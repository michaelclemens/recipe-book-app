import { getIngredients } from '@/lib/client'
import IngredientForm from '@/components/ingredient/IngredientForm'
import IngredientList from '@/components/ingredient/IngredientList'
import Paper, { PaperRow } from '@/components/ui/Paper'

export default async function IngredientsPage({ params: { id } }: { params: { id: string } }) {
  const ingredients = await getIngredients(id)
  return (
    <div className="flex flex-col overflow-hidden">
      <Paper>
        <PaperRow className="mb-7 underline underline-offset-4">Ingredients</PaperRow>
        <IngredientForm recipeId={id} />
        <IngredientList ingredients={ingredients} />
      </Paper>
    </div>
  )
}
