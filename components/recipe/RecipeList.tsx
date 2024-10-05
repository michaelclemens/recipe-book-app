import { getRecipes } from '@/lib/client'
import RecipeGallery from './RecipeGallery'

const recipeCount = 10

export default async function RecipeList({ query, currentPage }: { query: string; currentPage: number }) {
  const [totalCount, recipes] = await getRecipes(query, currentPage, recipeCount)
  const totalPages = Math.ceil(totalCount / recipeCount)

  return (
    <div className="flex h-full flex-col">
      <RecipeGallery recipes={recipes} totalPages={totalPages} />
    </div>
  )
}
