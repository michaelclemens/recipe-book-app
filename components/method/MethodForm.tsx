'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Method } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { FaCheck, FaPlus, FaTimes, FaTrashAlt } from 'react-icons/fa'
import { MethodFormFields, MethodSchema } from '@/lib/formSchema'
import { useMethodMutations } from '@/hooks/recipe/useMethods'
import { PaperInput, PaperTextarea } from '../ui/Paper'

export default function MethodForm({
  recipeId,
  method,
  stepNo,
  onDelete,
}: {
  recipeId: string
  method?: Method
  stepNo?: number
  onDelete?: (method: Method) => Promise<void>
}) {
  const {
    handleSubmit,
    register,
    setFocus,
    reset,
    formState: { dirtyFields, errors },
  } = useForm<MethodFormFields>({
    resolver: zodResolver(MethodSchema),
    defaultValues: {
      step: method?.step ?? '',
      stepTime: method?.stepTime ?? undefined,
    },
  })
  const { addMethod, updateMethod } = useMethodMutations(recipeId)
  const hasDirtyFields = Object.keys(dirtyFields).length > 0
  const editing = !!method

  const onSubmit = async (data: MethodFormFields) => {
    const response = editing ? await updateMethod(method.id, data) : await addMethod(data)

    if (!editing && response) {
      reset()
      setFocus('step')
    }

    // if (response.errors) {
    //   for (const { path, message } of response.errors) {
    //     setError(path as FieldPath<MethodFormFields>, { message })
    //   }
    // }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="group flex w-full items-start gap-2">
      {stepNo && <div>{stepNo}.</div>}
      <PaperTextarea className="h-full w-full resize-none" placeholder="Step..." {...register('step')} error={errors.step} />
      <PaperInput
        type="number"
        step={1}
        min={0}
        className="w-20 text-center"
        placeholder="Time..."
        {...register('stepTime')}
        error={errors.stepTime}
      />

      <div className="mt-1 ml-2 flex items-center justify-center gap-2 text-lg opacity-0 transition-opacity delay-100 duration-300 group-hover:opacity-100">
        {method ? (
          <>
            {onDelete && (
              <button type="button" title="Delete method" className="text-red-800" onClick={async () => onDelete(method)}>
                <FaTrashAlt />
              </button>
            )}
            <button type="submit" title="Update method" className="text-green-800 disabled:opacity-50" disabled={!hasDirtyFields}>
              <FaCheck />
            </button>
          </>
        ) : (
          <>
            <button type="button" title="Clear" className="text-red-800 disabled:opacity-50" onClick={() => reset()} disabled={!hasDirtyFields}>
              <FaTimes />
            </button>
            <button type="submit" title="Add method" className="text-green-800 disabled:opacity-50" disabled={!hasDirtyFields}>
              <FaPlus />
            </button>
          </>
        )}
      </div>
    </form>
  )
}
