import { useFragment } from '@/graphql/generated'
import {
  CreateRecipeDocument,
  DeleteRecipeDocument,
  GetRecipesDocument,
  RecipeFragmentFragment,
  RecipeFragmentFragmentDoc,
} from '@/graphql/generated/graphql'
import { dehydrate, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { RecipeFormFields } from '@/lib/formSchema'
import getGraphQLClient from '@/lib/graphQLClient'
import getQueryClient from '@/lib/queryClient'
import useFilterParams from '../useFilterParams'

type filterParams = {
  page?: number
  search?: string
}

const graphQLClient = getGraphQLClient()
const getQueryKey = (filter?: filterParams) => ['recipes', filter]

export const prefetchRecipes = async (filter?: filterParams) => {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: getQueryKey(filter),
    queryFn: async () => graphQLClient.request(GetRecipesDocument, { input: { ...filter } }),
  })
  return dehydrate(queryClient)
}

export const useRecipeMutations = () => {
  const { filter } = useFilterParams()
  const queryKey = getQueryKey(filter)
  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: async (data: RecipeFormFields) => graphQLClient.request(CreateRecipeDocument, { input: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (recipe: RecipeFragmentFragment) => graphQLClient.request(DeleteRecipeDocument, { id: recipe.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const addRecipe = async (data: RecipeFormFields) => {
    const { createRecipe } = await addMutation.mutateAsync(data)
    return createRecipe
  }
  const deleteRecipe = async (recipe: RecipeFragmentFragment) => deleteMutation.mutateAsync(recipe)

  return { addRecipe, deleteRecipe }
}

export default function useRecipes() {
  const { filter } = useFilterParams()
  const { data } = useQuery({
    queryKey: getQueryKey(filter),
    queryFn: async () => graphQLClient.request(GetRecipesDocument, { input: { ...filter } }),
  })
  const recipes = useFragment(RecipeFragmentFragmentDoc, data?.getRecipes.recipes ?? [])
  return { recipes, totalPages: data?.getRecipes.totalPages ?? 1 }
}
