'use client'

import { Ingredient } from '@prisma/client'
import { sortByOrder } from '@/util/sort'
import Paper, { PaperRow } from '../ui/Paper'

export default function IngredientSidebar({ ingredients }: { ingredients: Ingredient[] }) {
  return (
    <Paper>
      <PaperRow className="mb-7 underline underline-offset-4">Ingredients</PaperRow>
      <div className="h-full snap-y overflow-y-auto overflow-x-hidden pb-1 scrollbar scrollbar-track-transparent scrollbar-thumb-neutral-500/50">
        {ingredients.sort(sortByOrder).map(ingredient => (
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
