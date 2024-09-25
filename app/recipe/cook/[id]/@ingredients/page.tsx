import { getIngredients } from '@/lib/client'
import IngredientSidebar from '@/components/ingredient/IngredientSidebar'

export default async function CookRecipeIngredientPage({ params: { id } }: { params: { id: string } }) {
  const ingredients = await getIngredients(id)
  return <IngredientSidebar ingredients={ingredients} />
}
