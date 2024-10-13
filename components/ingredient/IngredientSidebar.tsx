'use client'

import useIngredients from '@/hooks/recipe/useIngredients'
import Paper from '../ui/Paper'

export default function IngredientSidebar({ recipeId }: { recipeId: string }) {
  const ingredients = useIngredients(recipeId)
  return (
    <Paper>
      <div className="mb-7 underline underline-offset-4">Ingredients</div>
      <div className="h-full snap-y overflow-y-auto overflow-x-hidden pb-1 scrollbar scrollbar-track-transparent scrollbar-thumb-neutral-500/50">
        {ingredients.map(ingredient => (
          <div key={ingredient.id} className="flex snap-start gap-2">
            {ingredient.quantity && <div>{ingredient.quantity}</div>}
            {ingredient.unit && <div>{ingredient.unit}</div>}
            <div className="truncate capitalize" title={ingredient.name}>
              {ingredient.name}
            </div>
          </div>
        ))}
      </div>
    </Paper>
  )
}
