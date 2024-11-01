import { getFragmentData } from '@/graphql/generated'
import { GetRecipeDocument, RecipeFragmentFragmentDoc } from '@/graphql/generated/graphql'
import { dehydrate, useQuery } from '@tanstack/react-query'
import getGraphQLClient from '@/lib/graphQLClient'
import getQueryClient from '@/lib/queryClient'

const graphQLClient = getGraphQLClient()
const getQueryKey = (recipeId: string) => ['recipe', recipeId]

export const prefetchRecipe = async (recipeId: string) => {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: getQueryKey(recipeId),
    queryFn: async () => graphQLClient.request(GetRecipeDocument, { id: recipeId }),
  })
  return dehydrate(queryClient)
}

export default function useRecipe(recipeId: string) {
  const { data } = useQuery({
    queryKey: getQueryKey(recipeId),
    queryFn: async () => graphQLClient.request(GetRecipeDocument, { id: recipeId }),
  })

  return getFragmentData(RecipeFragmentFragmentDoc, data?.getRecipe)
}
