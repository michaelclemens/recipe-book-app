'use client'

import useIngredients, { useIngredientMutations } from '@/hooks/recipe/useIngredients'
import { SortableVerticalList } from '../ui'
import IngredientForm from './IngredientForm'

export default function IngredientList({ recipeId }: { recipeId: string }) {
  const ingredients = useIngredients(recipeId)
  const { sortIngredients, deleteIngredient } = useIngredientMutations(recipeId)

  return (
    <SortableVerticalList items={ingredients} onSort={sortIngredients}>
      {ingredient => <IngredientForm recipeId={ingredient.recipeId} ingredient={ingredient} onDelete={deleteIngredient} />}
    </SortableVerticalList>
  )
}
