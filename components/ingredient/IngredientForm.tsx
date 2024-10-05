'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Ingredient } from '@prisma/client'
import { useAtom } from 'jotai'
import { FieldPath, useForm } from 'react-hook-form'
import { FaCheck, FaPlus, FaTimes, FaTrashAlt } from 'react-icons/fa'
import { ingredientsAtom } from '@/lib/atom'
import { addIngredient, updateIngredient } from '@/lib/client'
import { IngredientFormFields, IngredientSchema } from '@/lib/formSchema'
import { PaperInput, PaperRow } from '../ui/Paper'

export default function IngredientForm({
  recipeId,
  ingredient,
  onDelete,
}: {
  recipeId: string
  ingredient?: Ingredient
  onDelete?: (ingredient: Ingredient) => Promise<void>
}) {
  const {
    handleSubmit,
    register,
    setError,
    setFocus,
    reset,
    formState: { dirtyFields },
  } = useForm<IngredientFormFields>({
    resolver: zodResolver(IngredientSchema),
    defaultValues: {
      name: ingredient?.name ?? '',
      quantity: ingredient?.quantity ?? undefined,
      unit: ingredient?.unit ?? undefined,
      optional: ingredient?.optional ?? false,
    },
  })
  const [ingredients, setIngredients] = useAtom(ingredientsAtom)
  const hasDirtyFields = Object.keys(dirtyFields).length > 0

  const onSubmit = async (data: IngredientFormFields) => {
    const response = ingredient ? await updateIngredient(ingredient.id, data) : await addIngredient(recipeId, data)

    if (response.errors) {
      for (const { path, message } of response.errors) {
        setError(path as FieldPath<IngredientFormFields>, { message })
      }
    }

    if (response.ingredient) {
      setIngredients([...(ingredient ? ingredients.filter(item => item.id !== ingredient.id) : ingredients), response.ingredient])
      if (!ingredient) {
        reset()
        setFocus('quantity')
      }
    }
  }

  return (
    <PaperRow>
      <form onSubmit={handleSubmit(onSubmit)} className="group flex w-full gap-2">
        <PaperInput type="number" step={0.1} min={0} className="w-20" placeholder="Qty..." {...register('quantity')} />
        <PaperInput className="w-20" placeholder="Unit..." {...register('unit')} />
        <PaperInput className="w-full capitalize" placeholder="Ingredient..." {...register('name')} />

        <div className="ml-2 flex items-center justify-center gap-2 text-lg opacity-0 transition-opacity delay-100 duration-300 group-hover:opacity-100">
          {ingredient ? (
            <>
              {onDelete && (
                <button type="button" title="Delete ingredient" className="text-red-800" onClick={async () => onDelete(ingredient)}>
                  <FaTrashAlt />
                </button>
              )}
              <button type="submit" title="Update ingredient" className="text-green-800 disabled:opacity-50" disabled={!hasDirtyFields}>
                <FaCheck />
              </button>
            </>
          ) : (
            <>
              <button type="button" title="Clear" className="text-red-800 disabled:opacity-50" onClick={() => reset()} disabled={!hasDirtyFields}>
                <FaTimes />
              </button>
              <button type="submit" title="Add ingredient" className="text-green-800 disabled:opacity-50" disabled={!hasDirtyFields}>
                <FaPlus />
              </button>
            </>
          )}
        </div>
      </form>
    </PaperRow>
  )
}
