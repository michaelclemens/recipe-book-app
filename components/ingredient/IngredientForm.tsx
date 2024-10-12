'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Ingredient } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { FaCheck, FaPlus, FaTimes, FaTrashAlt } from 'react-icons/fa'
import { IngredientFormFields, IngredientSchema } from '@/lib/formSchema'
import { useIngredientMutations } from '@/hooks/recipe/useIngredients'
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
    setFocus,
    reset,
    formState: { dirtyFields, errors },
  } = useForm<IngredientFormFields>({
    resolver: zodResolver(IngredientSchema),
    defaultValues: {
      name: ingredient?.name ?? '',
      quantity: ingredient?.quantity ?? undefined,
      unit: ingredient?.unit ?? undefined,
      optional: ingredient?.optional ?? false,
    },
  })
  const { addIngredient, updateIngredient } = useIngredientMutations(recipeId)
  const hasDirtyFields = Object.keys(dirtyFields).length > 0

  const onSubmit = async (data: IngredientFormFields) => {
    try {
      const editing = !!ingredient
      editing ? await updateIngredient(ingredient.id, data) : await addIngredient(data)

      if (!editing) {
        reset()
        setFocus('quantity')
      }
    } catch (error) {
      console.error(error)
    }

    // if (response.status === 'error' && response.errors) {
    //   for (const { path, message } of response.errors) {
    //     setError(path as FieldPath<IngredientFormFields>, { message })
    //   }
    // }
  }

  return (
    <PaperRow>
      <form onSubmit={handleSubmit(onSubmit)} className="group flex w-full gap-2">
        <PaperInput type="number" step={0.1} min={0} className="w-20" placeholder="Qty..." {...register('quantity')} error={errors.quantity} />
        <PaperInput className="w-20" placeholder="Unit..." {...register('unit')} error={errors.unit} />
        <PaperInput className="w-full capitalize" placeholder="Ingredient..." {...register('name')} error={errors.name} />

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
