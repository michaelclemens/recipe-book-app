import { getRecipe } from '@/lib/client'

export default async function RecipePage({ params: { id } }: { params: { id: string } }) {
  const recipe = await getRecipe(id)
  return (
    <div>
      <h1>{recipe.name}</h1>
    </div>
  )
}
