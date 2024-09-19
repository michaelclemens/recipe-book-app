import { getIngredients } from '@/lib/client'
import { IngredientListWrapper } from './IngredientListItem'

export default async function IngredientList({ recipeId }: { recipeId: string }) {
  const ingredients = await getIngredients(recipeId)
  return (
    <div className="mt-7 space-y-2">
      <IngredientListWrapper ingredients={ingredients} />
    </div>
  )
}
