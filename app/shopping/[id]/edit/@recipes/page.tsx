import { HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import { prefetchRecipes } from '@/hooks/recipe/useRecipes'
import RecipeSidebar from '@/components/recipe/RecipeSidebar'

export default async function ShoppingListRecipePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params

  const { id } = params

  const recipes = await prefetchRecipes()
  return (
    <HydrationBoundary state={recipes}>
      <Suspense fallback="Loading...">
        <RecipeSidebar listId={id} />
      </Suspense>
    </HydrationBoundary>
  )
}
