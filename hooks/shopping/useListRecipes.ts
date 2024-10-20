import { Recipe } from '@prisma/client'
import { dehydrate, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { addListRecipe, deleteListRecipe, getListRecipes } from '@/lib/client/shopping'
import getQueryClient from '@/lib/queryClient'
import { sortByDate } from '@/util/sort'

const getQueryKey = (listId: string) => ['listRecipes', listId]

export const prefetchListRecipes = async (listId: string) => {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({ queryKey: getQueryKey(listId), queryFn: async () => getListRecipes(listId) })
  return dehydrate(queryClient)
}

export const useListRecipeMutations = (listId: string) => {
  const queryKey = getQueryKey(listId)
  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: addListRecipe,
    onSuccess: item => {
      queryClient.setQueryData(queryKey, (current: Recipe[]) => [...current, item])
      queryClient.invalidateQueries({ queryKey, refetchType: 'inactive' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteListRecipe,
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(queryKey, (current: Recipe[]) => current.filter(item => item.id !== variables.recipe.id))
      queryClient.invalidateQueries({ queryKey, refetchType: 'inactive' })
    },
  })

  const add = async (recipe: Recipe) => addMutation.mutateAsync({ listId, recipe })
  const remove = async (recipe: Recipe) => deleteMutation.mutateAsync({ listId, recipe })

  return { add, remove }
}

export default function useListRecipes(listId: string) {
  const queryKey = getQueryKey(listId)

  const { data: recipes } = useQuery({
    queryKey,
    placeholderData: [],
    queryFn: async () => getListRecipes(listId),
    select: useCallback((data: Recipe[]) => data.sort(sortByDate), []),
  })

  return recipes ?? []
}
