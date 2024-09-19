import { getRecipes } from '@/lib/client'
import { sortByDate } from '@/util/sort'
import RecipeListItem from './RecipeListItem'

export default async function RecipeList() {
  const recipes = await getRecipes()
  return (
    <div className="mb-7 space-y-5">
      {recipes.sort(sortByDate).map(recipe => (
        <RecipeListItem key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}
