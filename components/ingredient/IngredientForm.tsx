'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Ingredient, Unit } from '@prisma/client'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { FieldPath, useForm } from 'react-hook-form'
import { FaCheckCircle, FaPlus, FaTimes, FaTimesCircle } from 'react-icons/fa'
import { ingredientsAtom } from '@/lib/atom'
import { addIngredient, updateIngredient } from '@/lib/client'
import { IngredientFormFields, IngredientSchema } from '@/lib/formSchema'
import { unitLabelMap } from '@/util/unit'
import { Button, Input, SubmitButton, Select } from '../ui'

export default function IngredientForm({
  recipeId,
  ingredient,
  onCloseForm,
}: {
  recipeId: string
  ingredient?: Ingredient
  onCloseForm?: () => void
}) {
  const {
    handleSubmit,
    reset,
    register,
    setError,
    formState: { isSubmitSuccessful, errors, dirtyFields },
  } = useForm<IngredientFormFields>({
    resolver: zodResolver(IngredientSchema),
    defaultValues: {
      name: ingredient?.name ?? '',
      quantity: ingredient?.quantity ?? undefined,
      unitValue: ingredient?.unitValue ?? undefined,
      unit: ingredient?.unit ?? undefined,
    },
  })
  const [ingredients, setIngredients] = useAtom(ingredientsAtom)
  const editing = !!ingredient
  const hasDirtyFields = Object.keys(dirtyFields).length > 0

  useEffect(() => {
    isSubmitSuccessful && reset()
  }, [isSubmitSuccessful, reset])

  const onSubmit = async (data: IngredientFormFields) => {
    const response = editing ? await updateIngredient(ingredient.id, data) : await addIngredient(recipeId, data)

    if (response.errors) {
      for (const { path, message } of response.errors) {
        setError(path as FieldPath<IngredientFormFields>, { message })
      }
    }

    if (response.ingredient) {
      setIngredients([...(editing ? ingredients.filter(item => item.id !== ingredient.id) : ingredients), response.ingredient])
      onCancel()
    }
  }

  const onCancel = () => {
    onCloseForm && onCloseForm()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="my-2 w-full">
      <div className="flex flex-row items-center space-x-2">
        <Input type="number" min={0} placeholder="Quantity..." {...register('quantity')} error={errors.quantity} />
        <div className="relative w-full">
          <Input className="pr-20" type="number" step={0.1} min={0} placeholder="Unit..." {...register('unitValue')} error={errors.unitValue} />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <Select {...register('unit')} error={errors.unit}>
              <option></option>
              {Object.values(Unit).map(unit => (
                <option key={unit} value={unit}>
                  {unitLabelMap[unit]}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <Input className="capitalize" type="text" placeholder="Ingredient..." {...register('name')} error={errors.name} />

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
