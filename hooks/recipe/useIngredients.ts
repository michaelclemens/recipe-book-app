import { getFragmentData } from '@/graphql/generated'
import {
  AddIngredientDocument,
  DeleteIngredientDocument,
  GetIngredientsDocument,
  GetIngredientsQuery,
  IngredientFragmentFragment,
  IngredientFragmentFragmentDoc,
  SortIngredientsDocument,
  UpdateIngredientDocument,
} from '@/graphql/generated/graphql'
import { dehydrate, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { IngredientFormFields } from '@/lib/formSchema'
import getGraphQLClient from '@/lib/graphQLClient'
import getQueryClient from '@/lib/queryClient'

const graphQLClient = getGraphQLClient()
const getQueryKey = (recipeId: string) => ['recipeIngredients', recipeId]

export const prefetchIngredients = async (recipeId: string) => {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: getQueryKey(recipeId),
    queryFn: async () => graphQLClient.request(GetIngredientsDocument, { recipeId }),
  })
  return dehydrate(queryClient)
}

export const useIngredientMutations = (recipeId: string) => {
  const queryKey = getQueryKey(recipeId)
  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: async ({ recipeId, data }: { recipeId: string; data: IngredientFormFields }) =>
      graphQLClient.request(AddIngredientDocument, { recipeId, input: data }),
    onSuccess: ({ addIngredient }) => {
      const ingredient = getFragmentData(IngredientFragmentFragmentDoc, addIngredient)
      queryClient.setQueryData(queryKey, (current: GetIngredientsQuery) => ({
        ...current,
        getRecipe: { ingredients: [...getFragmentData(IngredientFragmentFragmentDoc, current.getRecipe?.ingredients ?? []), ingredient] },
      }))
      queryClient.invalidateQueries({ queryKey, refetchType: 'inactive' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: IngredientFormFields }) =>
      graphQLClient.request(UpdateIngredientDocument, { id, input: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey, refetchType: 'inactive' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => graphQLClient.request(DeleteIngredientDocument, { id }),
    onSuccess: (_, id) => {
      queryClient.setQueryData(queryKey, (current: GetIngredientsQuery) => ({
        ...current,
        getRecipe: {
          ingredients: getFragmentData(IngredientFragmentFragmentDoc, current.getRecipe?.ingredients ?? []).filter(item => item.id !== id),
        },
      }))
      queryClient.invalidateQueries({ queryKey, refetchType: 'inactive' })
    },
  })

  const sortMutation = useMutation({
    mutationFn: async (ingredients: IngredientFragmentFragment[]) =>
      graphQLClient.request(SortIngredientsDocument, { input: ingredients.map(ingredient => ({ id: ingredient.id, order: ingredient.order })) }),
    onMutate: async sortedIngredients => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueriesData({ queryKey })
      queryClient.setQueryData(queryKey, (current: GetIngredientsQuery) => ({
        ...current,
        getRecipe: { ingredients: sortedIngredients },
      }))
      return { previous }
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previous)
    },
    onSuccess: ({ sortIngredients }) => {
      queryClient.setQueryData(queryKey, (current: GetIngredientsQuery) => ({
        ...current,
        getRecipe: { ingredients: sortIngredients },
      }))
      queryClient.invalidateQueries({ queryKey, refetchType: 'inactive' })
    },
  })

  const addIngredient = async (data: IngredientFormFields) => addMutation.mutateAsync({ recipeId, data })
  const updateIngredient = async (id: string, data: IngredientFormFields) => updateMutation.mutateAsync({ id, data })
  const deleteIngredient = async (ingredient: IngredientFragmentFragment) => deleteMutation.mutateAsync(ingredient.id)
  const sortIngredients = async (ingredients: IngredientFragmentFragment[]) => {
    sortMutation.mutateAsync(ingredients)
  }

  return { addIngredient, updateIngredient, deleteIngredient, sortIngredients }
}

export default function useIngredients(recipeId: string) {
  const queryKey = getQueryKey(recipeId)

  const { data } = useQuery({
    queryKey,
    queryFn: async () => graphQLClient.request(GetIngredientsDocument, { recipeId }),
  })

  return getFragmentData(IngredientFragmentFragmentDoc, data?.getRecipe?.ingredients ?? [])
}
