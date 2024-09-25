import IngredientForm from '@/components/ingredient/IngredientForm'
import IngredientList from '@/components/ingredient/IngredientList'

export default async function IngredientsPage({ params: { id } }: { params: { id: string } }) {
  return (
    <div className="flex h-full flex-col overflow-hidden pt-5">
      <IngredientForm recipeId={id} />
      <IngredientList recipeId={id} />
    </div>
  )
}
