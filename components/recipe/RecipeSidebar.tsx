'use client'

import { FaMagnifyingGlass, FaPlus } from 'react-icons/fa6'
import useRecipes from '@/hooks/recipe/useRecipes'
import { useListRecipeMutations } from '@/hooks/shopping/useListRecipes'
import useFilterParams from '@/hooks/useFilterParams'
import Paper, { PaperInput } from '../ui/Paper'

export default function RecipeSidebar({ listId }: { listId: string }) {
  const {
    form: { register, handleSubmit },
    onSearch,
  } = useFilterParams()
  const { recipes } = useRecipes()
  const { add } = useListRecipeMutations(listId)

  return (
    <Paper>
      <div className="mb-7 underline underline-offset-4">Recipes</div>
      <form className="mb-7 flex w-full" onSubmit={handleSubmit(onSearch)}>
        <PaperInput type="text" {...register('search')} className="w-full" placeholder="Search..." />
        <button type="submit" className="mb-1 ml-5 text-lg">
          <FaMagnifyingGlass />
        </button>
      </form>
      <div className="h-full snap-y overflow-y-auto overflow-x-hidden pb-1 scrollbar scrollbar-track-transparent scrollbar-thumb-neutral-500/50">
        {recipes.map(recipe => (
          <div key={recipe.id} className="group flex snap-start gap-2">
            <div className="w-full truncate">{recipe.name}</div>
            <div className="ml-2 flex items-center justify-center gap-2 text-lg opacity-0 transition-opacity delay-100 duration-300 group-hover:opacity-100">
              <button
                type="button"
                onClick={async () => add(recipe)}
                title="Add recipe to shopping list"
                className="text-green-800 disabled:opacity-50"
              >
                <FaPlus />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Paper>
  )
}
