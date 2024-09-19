import { getRecipes } from '@/lib/client'
import { sortByDate } from '@/util/sort'
import RecipeListItem from './RecipeListItem'

export default async function RecipeList() {
  const recipes = await getRecipes()
  return (
    <div>
      {recipes.sort(sortByDate).map(recipe => (
        <RecipeListItem key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}
