'use client'

import useIngredients from '@/hooks/useIngredients'
import Paper, { PaperRow } from '../ui/Paper'

export default function IngredientSidebar({ recipeId }: { recipeId: string }) {
  const ingredients = useIngredients(recipeId)
  return (
    <Paper>
      <PaperRow className="mb-7 underline underline-offset-4">Ingredients</PaperRow>
      <div className="h-full snap-y overflow-y-auto overflow-x-hidden pb-1 scrollbar scrollbar-track-transparent scrollbar-thumb-neutral-500/50">
        {ingredients.map(ingredient => (
          <PaperRow key={ingredient.id} className="flex snap-start gap-2">
            {ingredient.quantity && <div>{ingredient.quantity}</div>}
            {ingredient.unit && <div>{ingredient.unit}</div>}
            <div className="truncate capitalize" title={ingredient.name}>
              {ingredient.name}
            </div>
          </PaperRow>
        ))}
      </div>
    </Paper>
  )
}
