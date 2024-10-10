import { dehydrate, useQuery } from '@tanstack/react-query'
import { getRecipe } from '@/lib/client'
import getQueryClient from '@/lib/queryClient'

const getQueryKey = (recipeId: string) => ['recipe', recipeId]

export const prefetchRecipe = async (recipeId: string) => {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({ queryKey: getQueryKey(recipeId), queryFn: async () => getRecipe(recipeId) })
  return dehydrate(queryClient)
}

export default function useRecipe(recipeId: string) {
  const { data: recipe } = useQuery({
    queryKey: getQueryKey(recipeId),
    queryFn: async () => getRecipe(recipeId),
  })

  return { recipe }
}
