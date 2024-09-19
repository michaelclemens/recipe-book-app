'use client'

import { Ingredient } from '@prisma/client'
import { useAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { useState } from 'react'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import { ingredientsAtom } from '@/lib/atom'
import { deleteIngredient, updateIngredientOrder } from '@/lib/client'
import { unitLabelMap } from '@/util/unit'
import { Button, SortableVerticalList } from '../ui'
import IngredientForm from './IngredientForm'

export function IngredientListWrapper({ ingredients: initialIngredients }: { ingredients: Ingredient[] }) {
  useHydrateAtoms([[ingredientsAtom, initialIngredients]])
  const [ingredients, setIngredients] = useAtom(ingredientsAtom)

  const onNewSortOrder = async (sortedIngredients: Ingredient[]) => {
    setIngredients(sortedIngredients)
    await updateIngredientOrder(sortedIngredients)
  }

  const onDelete = async (ingredient: Ingredient) => {
    await deleteIngredient(ingredient)
    setIngredients([...ingredients.filter(item => item.id !== ingredient.id)])
  }

  return (
    <SortableVerticalList items={ingredients} onNewSortOrder={onNewSortOrder}>
      {ingredient => <IngredientListItem ingredient={ingredient} onDelete={onDelete} />}
    </SortableVerticalList>
  )
}

export default function IngredientListItem({
  ingredient,
  onDelete,
}: {
  ingredient: Ingredient
  onDelete: (ingredient: Ingredient) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  return (
    <div className="flex min-h-14 flex-grow flex-row items-center justify-between space-x-2">
      {editing ? (
        <IngredientForm recipeId={ingredient.recipeId} ingredient={ingredient} onCloseForm={() => setEditing(false)} />
      ) : (
        <>
          {ingredient.quantity && <div>{ingredient.quantity}</div>}
          {ingredient.unitValue && (
            <div>
              {ingredient.unitValue} {ingredient.unit && unitLabelMap[ingredient.unit]}
            </div>
          )}
          <div>{ingredient.name}</div>
          <div className="flex justify-end space-x-2">
            <Button title="Edit" onClick={() => setEditing(true)}>
              <FaEdit />
            </Button>
            <Button title="Delete" onClick={async () => onDelete(ingredient)}>
              <FaTrashAlt />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
