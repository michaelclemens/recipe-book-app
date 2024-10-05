'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Method } from '@prisma/client'
import { useAtom } from 'jotai'
import { FieldPath, useForm } from 'react-hook-form'
import { FaCheck, FaPlus, FaTimes, FaTrashAlt } from 'react-icons/fa'
import { methodsAtom } from '@/lib/atom'
import { addMethod, updateMethod } from '@/lib/client'
import { MethodFormFields, MethodSchema } from '@/lib/formSchema'
import { PaperInput, PaperRow, PaperTextarea } from '../ui/Paper'

export default function MethodForm({
  recipeId,
  method,
  onDelete,
}: {
  recipeId: string
  method?: Method
  onDelete?: (method: Method) => Promise<void>
}) {
  const {
    handleSubmit,
    register,
    setError,
    setFocus,
    reset,
    formState: { dirtyFields },
  } = useForm<MethodFormFields>({
    resolver: zodResolver(MethodSchema),
    defaultValues: {
      step: method?.step ?? '',
      stepTime: method?.stepTime ?? undefined,
    },
  })
  const [methods, setMethods] = useAtom(methodsAtom)
  const hasDirtyFields = Object.keys(dirtyFields).length > 0

  const onSubmit = async (data: MethodFormFields) => {
    const response = method ? await updateMethod(method.id, data) : await addMethod(recipeId, data)

    if (response.errors) {
      for (const { path, message } of response.errors) {
        setError(path as FieldPath<MethodFormFields>, { message })
      }
    }

    if (response.method) {
      setMethods([...(method ? methods.filter(item => item.id !== method.id) : methods), response.method])
      if (!method) {
        reset()
        setFocus('step')
      }
    }
  }

  return (
    <PaperRow>
      <form onSubmit={handleSubmit(onSubmit)} className="group flex w-full items-start gap-2">
        <PaperTextarea className="h-full w-full resize-none" placeholder="Step..." {...register('step')} />
        <PaperInput type="number" step={1} min={0} className="w-20" placeholder="Time..." {...register('stepTime')} />

        <div className="ml-2 mt-1 flex items-center justify-center gap-2 text-lg opacity-0 transition-opacity delay-100 duration-300 group-hover:opacity-100">
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
    </PaperRow>
  )
}
