'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { FieldPath, useForm } from 'react-hook-form'
import { FaPlus, FaTimes } from 'react-icons/fa'
import { createRecipe } from '@/lib/client'
import { RecipeFormFields, RecipeSchema } from '@/lib/formSchema'
import { Button, Input, SubmitButton } from '../ui'

export default function RecipeForm() {
  const { push } = useRouter()
  const {
    handleSubmit,
    reset,
    register,
    setError,
    formState: { errors, dirtyFields },
  } = useForm<RecipeFormFields>({ resolver: zodResolver(RecipeSchema) })
  const hasDirtyFields = Object.keys(dirtyFields).length > 0

  const onSubmit = async (data: RecipeFormFields) => {
    const response = await createRecipe(data)

    if (response.errors) {
      for (const { path, message } of response.errors) {
        setError(path as FieldPath<RecipeFormFields>, { message })
      }
    }

    if (response.recipe) {
      push(`/recipe/${response.recipe.id}`)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="my-2 w-full">
      <div className="flex flex-row items-center space-x-2">
        <Input type="text" placeholder="Recipe name..." {...register('name')} error={errors.name} />

        <Button disabled={!hasDirtyFields} title="Reset" onClick={() => reset()}>
          <FaTimes />
        </Button>
        <SubmitButton disabled={!hasDirtyFields} title="Create Recipe">
          <FaPlus />
        </SubmitButton>
      </div>
    </form>
  )
}
