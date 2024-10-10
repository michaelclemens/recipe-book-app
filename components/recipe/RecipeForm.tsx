'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { FaPlus, FaTimes } from 'react-icons/fa'
import { RecipeFormFields, RecipeSchema } from '@/lib/formSchema'
import { useRecipeMutations } from '@/hooks/useRecipes'
import { Button, Input, SubmitButton } from '../ui'

export default function RecipeForm() {
  const { push } = useRouter()
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, dirtyFields },
  } = useForm<RecipeFormFields>({ resolver: zodResolver(RecipeSchema) })
  const hasDirtyFields = Object.keys(dirtyFields).length > 0
  const { addRecipe } = useRecipeMutations()

  const onSubmit = async (data: RecipeFormFields) => {
    const recipe = await addRecipe(data)
    if (recipe) {
      push(`/recipe/edit/${recipe.id}`)
    }

    // if (response.errors) {
    //   for (const { path, message } of response.errors) {
    //     setError(path as FieldPath<RecipeFormFields>, { message })
    //   }
    // }

    // if (response.recipe) {
    //   push(`/recipe/edit/${response.recipe.id}`)
    // }
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
