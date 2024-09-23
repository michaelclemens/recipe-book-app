'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Method } from '@prisma/client'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { FieldPath, useForm } from 'react-hook-form'
import { FaCheckCircle, FaPlus, FaTimes, FaTimesCircle } from 'react-icons/fa'
import { methodsAtom } from '@/lib/atom'
import { addMethod, updateMethod } from '@/lib/client'
import { MethodFormFields, MethodSchema } from '@/lib/formSchema'
import { Button, Input, SubmitButton, Textarea } from '../ui'

export default function MethodForm({ recipeId, method, onCloseForm }: { recipeId: string; method?: Method; onCloseForm?: () => void }) {
  const {
    handleSubmit,
    reset,
    register,
    setError,
    setFocus,
    formState: { isSubmitSuccessful, errors, dirtyFields },
  } = useForm<MethodFormFields>({
    resolver: zodResolver(MethodSchema),
    defaultValues: {
      step: method?.step ?? '',
      stepTime: method?.stepTime ?? undefined,
    },
  })
  const [methods, setMethods] = useAtom(methodsAtom)
  const editing = !!method
  const hasDirtyFields = Object.keys(dirtyFields).length > 0

  useEffect(() => {
    isSubmitSuccessful && reset()
  }, [isSubmitSuccessful, reset])

  const onSubmit = async (data: MethodFormFields) => {
    const response = editing ? await updateMethod(method.id, data) : await addMethod(recipeId, data)

    if (response.errors) {
      for (const { path, message } of response.errors) {
        setError(path as FieldPath<MethodFormFields>, { message })
      }
    }

    if (response.method) {
      setMethods([...(editing ? methods.filter(item => item.id !== method.id) : methods), response.method])
      onCancel()
      !editing && setFocus('step')
    }
  }

  const onCancel = () => {
    onCloseForm && onCloseForm()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="my-2 w-full">
      <div className="flex flex-row items-center space-x-2">
        <Textarea placeholder="Step..." {...register('step')} error={errors.step} />

        <div className="flex justify-end space-x-2">
          <div className="relative">
            <Input className="w-36 pr-12" type="number" min={0} step={1} placeholder="Time..." {...register('stepTime')} error={errors.stepTime} />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-slate-500">min</span>
            </div>
          </div>

          {editing ? (
            <>
              <Button title="Cancel" onClick={() => onCancel()}>
                <FaTimesCircle />
              </Button>
              <SubmitButton disabled={!hasDirtyFields} title="Update">
                <FaCheckCircle />
              </SubmitButton>
            </>
          ) : (
            <>
              <Button disabled={!hasDirtyFields} title="Reset" onClick={() => reset()}>
                <FaTimes />
              </Button>
              <SubmitButton disabled={!hasDirtyFields} title="Add">
                <FaPlus />
              </SubmitButton>
            </>
          )}
        </div>
      </div>
    </form>
  )
}