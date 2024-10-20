import { HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import { prefetchIngredients } from '@/hooks/recipe/useIngredients'
import IngredientSidebar from '@/components/ingredient/IngredientSidebar'

export default async function CookRecipeIngredientPage({ params: { id } }: { params: { id: string } }) {
  const ingredients = await prefetchIngredients(id)
  return (
    <HydrationBoundary state={ingredients}>
      <Suspense fallback="Loading...">
        <IngredientSidebar recipeId={id} />
      </Suspense>
    </HydrationBoundary>
  )
}
