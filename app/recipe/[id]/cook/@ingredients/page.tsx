import { HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import { prefetchIngredients } from '@/hooks/recipe/useIngredients'
import IngredientSidebar from '@/components/ingredient/IngredientSidebar'

export default async function CookRecipeIngredientPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params

  const { id } = params

  const ingredients = await prefetchIngredients(id)
  return (
    <HydrationBoundary state={ingredients}>
      <Suspense fallback="Loading...">
        <IngredientSidebar recipeId={id} />
      </Suspense>
    </HydrationBoundary>
  )
}
