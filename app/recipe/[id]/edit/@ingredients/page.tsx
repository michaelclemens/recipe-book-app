import { HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import { prefetchIngredients } from '@/hooks/recipe/useIngredients'
import IngredientForm from '@/components/ingredient/IngredientForm'
import IngredientList from '@/components/ingredient/IngredientList'
import Paper from '@/components/ui/Paper'

export default async function IngredientsPage({ params: { id } }: { params: { id: string } }) {
  const ingredients = await prefetchIngredients(id)

  return (
    <div className="flex flex-col overflow-hidden">
      <Paper>
        <div className="mb-7 underline underline-offset-4">Ingredients</div>
        <IngredientForm recipeId={id} />
        <HydrationBoundary state={ingredients}>
          <Suspense fallback="Loading...">
            <IngredientList recipeId={id} />
          </Suspense>
        </HydrationBoundary>
      </Paper>
    </div>
  )
}
