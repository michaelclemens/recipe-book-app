import { HydrationBoundary } from '@tanstack/react-query'
import { prefetchIngredients } from '@/hooks/useIngredients'
import IngredientSidebar from '@/components/ingredient/IngredientSidebar'

export default async function CookRecipeIngredientPage({ params: { id } }: { params: { id: string } }) {
  const ingredients = await prefetchIngredients(id)
  return (
    <HydrationBoundary state={ingredients}>
      <IngredientSidebar recipeId={id} />
    </HydrationBoundary>
  )
}
