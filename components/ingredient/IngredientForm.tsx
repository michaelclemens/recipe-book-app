'use client'

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Ingredient } from '@prisma/client'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { Controller, FieldPath, useForm } from 'react-hook-form'
import { FaCheckCircle, FaChevronDown, FaPlus, FaTimes, FaTimesCircle } from 'react-icons/fa'
import { ingredientsAtom } from '@/lib/atom'
import { addIngredient, updateIngredient } from '@/lib/client'
import { IngredientFormFields, IngredientSchema } from '@/lib/formSchema'
import { unitLabelMap } from '@/util/unit'
import { Button, Input, SubmitButton, Select, Checkbox } from '../ui'

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
    setFocus,
    control,
    formState: { isSubmitSuccessful, errors, dirtyFields },
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
  const editing = !!ingredient
  const hasDirtyFields = Object.keys(dirtyFields).length > 0

  const units = Object.values(unitLabelMap)
  const [query, setQuery] = useState('')

  const filteredUnits = query === '' ? units : units.filter(unit => unit.toLowerCase().includes(query.toLowerCase()))

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
      !editing && setFocus('quantity')
    }
  }

  const onCancel = () => {
    onCloseForm && onCloseForm()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="my-2 w-full">
      <div className="flex flex-row items-center space-x-2">
        <div className="flex justify-start space-x-2">
          <div className="relative">
            <Input
              className="w-36 pr-24"
              type="number"
              step={0.1}
              min={0}
              placeholder="Quantity..."
              {...register('quantity')}
              error={errors.quantity}
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Controller
                control={control}
                name="unit"
                shouldUnregister={true}
                render={({ field }) => (
                  <Combobox defaultValue={field.value} onClose={() => setQuery('')}>
                    <div className="relative h-full grow">
                      <ComboboxInput
                        ref={field.ref}
                        name={field.name}
                        onChange={event => {
                          field.onChange(event)
                          setQuery(event.target.value)
                        }}
                        className="h-full w-24 rounded-md border-0 bg-transparent py-0 pl-3 pr-8 text-left focus:ring-2 focus:ring-inset focus:ring-indigo-900"
                      />
                      <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                        <FaChevronDown className="" />
                      </ComboboxButton>
                    </div>
                    <ComboboxOptions
                      anchor="bottom"
                      transition
                      className="w-[var(--input-width)] rounded-b-md border border-slate-700 bg-slate-900 p-1 empty:invisible"
                    >
                      {query.length > 0 && (
                        <ComboboxOption
                          value={query}
                          className="flex cursor-default select-none items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10"
                        >
                          <span className="font-bold">"{query}"</span>
                        </ComboboxOption>
                      )}
                      {filteredUnits.map(unit => (
                        <ComboboxOption
                          key={unit}
                          value={unit}
                          className="flex cursor-default select-none items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10"
                        >
                          {unit}
                        </ComboboxOption>
                      ))}
                    </ComboboxOptions>
                  </Combobox>
                )}
              />

              {/* <Select {...register('unit')} error={errors.unit}>
                <option></option>
                {Object.values(unitLabelMap).map(unit => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </Select> */}
            </div>
          </div>
        </div>
        <Input className="capitalize" type="text" placeholder="Ingredient..." {...register('name')} error={errors.name} />
        <Controller
          control={control}
          name="optional"
          render={({ field: { onChange, value } }) => <Checkbox label="Opt" defaultChecked onChange={onChange} checked={value} />}
        />

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
