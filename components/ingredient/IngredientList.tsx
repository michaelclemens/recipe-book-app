'use client'

import { Ingredient } from '@prisma/client'
import { useAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { ingredientsAtom } from '@/lib/atom'
import { deleteIngredient, updateIngredientOrder } from '@/lib/client'
import { SortableVerticalList } from '../ui'
import IngredientForm from './IngredientForm'

export default function IngredientList({ ingredients: initialIngredients }: { ingredients: Ingredient[] }) {
  useHydrateAtoms([[ingredientsAtom, initialIngredients]])
  const [ingredients, setIngredients] = useAtom(ingredientsAtom)

  const onDelete = async (ingredient: Ingredient) => {
    await deleteIngredient(ingredient)
    setIngredients([...ingredients.filter(item => item.id !== ingredient.id)])
  }

  const onSort = async (sortedIngredients: Ingredient[]) => {
    setIngredients(sortedIngredients)
    await updateIngredientOrder(sortedIngredients)
  }

  return (
    <div className="z-10 -ml-8 h-full snap-y overflow-y-auto scrollbar scrollbar-track-transparent scrollbar-thumb-neutral-500/50">
      <SortableVerticalList items={ingredients} onSort={onSort}>
        {ingredient => <IngredientForm key={ingredient.id} recipeId={ingredient.recipeId} ingredient={ingredient} onDelete={onDelete} />}
      </SortableVerticalList>
    </div>
  )
}
