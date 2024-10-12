import { Ingredient } from '@prisma/client'
import { dehydrate, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import {
  addIngredient as clientAddIngredient,
  deleteIngredient as clientDeleteIngredient,
  getIngredients,
  updateIngredient as clientUpdateIngredient,
  updateIngredientOrder,
} from '@/lib/client/recipe'
import { IngredientFormFields } from '@/lib/formSchema'
import getQueryClient from '@/lib/queryClient'
import { sortByOrder } from '@/util/sort'

const getQueryKey = (recipeId: string) => ['recipeIngredients', recipeId]

export const prefetchIngredients = async (recipeId: string) => {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({ queryKey: getQueryKey(recipeId), queryFn: async () => getIngredients(recipeId) })
  return dehydrate(queryClient)
}

export const useIngredientMutations = (recipeId: string) => {
  const queryKey = getQueryKey(recipeId)
  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: clientAddIngredient,
    onSuccess: ingredient => {
      queryClient.setQueryData(queryKey, (current: Ingredient[]) => [...current, ingredient])
      queryClient.invalidateQueries({ queryKey, refetchType: 'inactive' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: clientUpdateIngredient,
    onSuccess: ingredient => {
      queryClient.setQueryData(queryKey, (current: Ingredient[]) => current.map(item => (item.id === ingredient.id ? ingredient : item)))
      queryClient.invalidateQueries({ queryKey, refetchType: 'inactive' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: clientDeleteIngredient,
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(queryKey, (current: Ingredient[]) => current.filter(item => item.id !== variables.id))
      queryClient.invalidateQueries({ queryKey, refetchType: 'inactive' })
    },
  })

  const sortMutation = useMutation({
    mutationFn: updateIngredientOrder,
    onMutate: async sortedIngredients => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueriesData({ queryKey })
      queryClient.setQueryData(queryKey, sortedIngredients)
      return { previous }
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previous)
    },
    onSuccess: sortedIngredients => {
      queryClient.setQueryData(queryKey, () => sortedIngredients)
      queryClient.invalidateQueries({ queryKey, refetchType: 'inactive' })
    },
  })

  const addIngredient = async (data: IngredientFormFields) => addMutation.mutateAsync({ recipeId, data })
  const updateIngredient = async (id: string, data: IngredientFormFields) => updateMutation.mutateAsync({ id, data })
  const deleteIngredient = async (ingredient: Ingredient) => deleteMutation.mutateAsync(ingredient)
  const sortIngredients = async (ingredients: Ingredient[]) => {
    sortMutation.mutateAsync(ingredients)
  }

  return { addIngredient, updateIngredient, deleteIngredient, sortIngredients }
}

export default function useIngredients(recipeId: string) {
  const queryKey = getQueryKey(recipeId)

  const { data: ingredients } = useQuery({
    queryKey,
    placeholderData: [],
    queryFn: async () => getIngredients(recipeId),
    select: useCallback((data: Ingredient[]) => data.sort(sortByOrder), []),
  })

  return ingredients ?? []
}
