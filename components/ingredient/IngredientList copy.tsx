import { getIngredients } from '@/lib/client'
import { IngredientListWrapper } from './IngredientListItem'

export default async function IngredientList({ recipeId }: { recipeId: string }) {
  const ingredients = await getIngredients(recipeId)
  return (
    <div className="mt-5 h-screen space-y-2 overflow-y-auto pr-3 pt-1 scrollbar scrollbar-track-transparent scrollbar-thumb-slate-800">
      <IngredientListWrapper ingredients={ingredients} />
    </div>
  )
}
