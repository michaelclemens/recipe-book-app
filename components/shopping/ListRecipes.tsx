'use client'

import { FaTrashAlt } from 'react-icons/fa'
import useListRecipes, { useListRecipeMutations } from '@/hooks/shopping/useListRecipes'

export default function ListRecipes({ listId }: { listId: string }) {
  const recipes = useListRecipes(listId)
  const { remove } = useListRecipeMutations(listId)

  return recipes.map(recipe => (
    <div key={recipe.id} className="group flex snap-start gap-2">
      <div className="w-full">{recipe.name}</div>
      <div className="ml-2 flex items-center justify-center gap-2 text-lg opacity-0 transition-opacity delay-100 duration-300 group-hover:opacity-100">
        <button type="button" title="Delete recipe from list" className="text-red-800" onClick={async () => remove(recipe)}>
          <FaTrashAlt />
        </button>
      </div>
    </div>
  ))
}
