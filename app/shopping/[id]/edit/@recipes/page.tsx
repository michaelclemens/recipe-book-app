import { HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import { prefetchRecipes } from '@/hooks/recipe/useRecipes'
import RecipeSidebar from '@/components/recipe/RecipeSidebar'

export default async function ShoppingListRecipePage({ params: { id } }: { params: { id: string } }) {
  const recipes = await prefetchRecipes()
  return (
    <HydrationBoundary state={recipes}>
      <Suspense fallback="Loading...">
        <RecipeSidebar listId={id} />
      </Suspense>
    </HydrationBoundary>
  )
}
