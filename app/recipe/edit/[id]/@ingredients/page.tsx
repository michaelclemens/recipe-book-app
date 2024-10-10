import { HydrationBoundary } from '@tanstack/react-query'
import { prefetchIngredients } from '@/hooks/useIngredients'
import IngredientForm from '@/components/ingredient/IngredientForm'
import IngredientList from '@/components/ingredient/IngredientList'
import Paper, { PaperRow } from '@/components/ui/Paper'

export default async function IngredientsPage({ params: { id } }: { params: { id: string } }) {
  const ingredients = await prefetchIngredients(id)

  return (
    <div className="flex flex-col overflow-hidden">
      <Paper>
        <PaperRow className="mb-7 underline underline-offset-4">Ingredients</PaperRow>
        <IngredientForm recipeId={id} />
        <HydrationBoundary state={ingredients}>
          <IngredientList recipeId={id} />
        </HydrationBoundary>
      </Paper>
    </div>
  )
}
