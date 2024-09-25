import { getRecipes } from '@/lib/client'
import RecipeGallery from './RecipeGallery'

const recipeCount = 12

export default async function RecipeList({ query, currentPage }: { query: string; currentPage: number }) {
  const [totalCount, recipes] = await getRecipes(query, currentPage, recipeCount)
  const totalPages = Math.ceil(totalCount / recipeCount)

  return (
    <div className="relative mb-5 p-2">
      <RecipeGallery recipes={recipes} totalPages={totalPages} />
    </div>
  )
}
