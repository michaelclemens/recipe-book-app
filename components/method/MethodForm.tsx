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
import { Button, Input, SubmitButton } from '../ui'

export default function MethodForm({ recipeId, method, onCloseForm }: { recipeId: string; method?: Method; onCloseForm?: () => void }) {
  const {
    handleSubmit,
    reset,
    register,
    setError,
    formState: { isSubmitSuccessful, errors, dirtyFields },
  } = useForm<MethodFormFields>({
    resolver: zodResolver(MethodSchema),
    defaultValues: {
      step: method?.step ?? '',
      hour: method?.hour ?? undefined,
      minute: method?.minute ?? undefined,
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
    }
  }

  const onCancel = () => {
    onCloseForm && onCloseForm()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="my-2 w-full">
      <div className="flex flex-row items-center space-x-2">
        <Input type="text" placeholder="Step..." {...register('step')} error={errors.step} />
        <Input type="number" min={0} placeholder="Hours..." {...register('hour')} error={errors.hour} />
        <Input type="number" min={0} placeholder="Minutes..." {...register('minute')} error={errors.minute} />

        <div className="flex justify-end space-x-2">
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
