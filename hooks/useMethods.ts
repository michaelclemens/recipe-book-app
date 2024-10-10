import { Method } from '@prisma/client'
import { dehydrate, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import {
  addMethod as clientAddMethod,
  updateMethod as clientUpdateMethod,
  deleteMethod as clientDeleteMethod,
  getMethods,
  updateMethodOrder,
} from '@/lib/client'
import { MethodFormFields } from '@/lib/formSchema'
import getQueryClient from '@/lib/queryClient'
import { sortByOrder } from '@/util/sort'

const getQueryKey = (recipeId: string) => ['recipeMethods', recipeId]

export const prefetchMethods = async (recipeId: string) => {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({ queryKey: getQueryKey(recipeId), queryFn: async () => getMethods(recipeId) })
  return dehydrate(queryClient)
}

export const useMethodMutations = (recipeId: string) => {
  const queryKey = getQueryKey(recipeId)
  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: clientAddMethod,
    onSuccess: method => {
      queryClient.setQueryData(queryKey, (current: Method[]) => [...current, method])
      queryClient.invalidateQueries({ queryKey, refetchType: 'inactive' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: clientUpdateMethod,
    onSuccess: method => {
      queryClient.setQueryData(queryKey, (current: Method[]) => current.map(item => (item.id === method.id ? method : item)))
      queryClient.invalidateQueries({ queryKey, refetchType: 'inactive' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: clientDeleteMethod,
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(queryKey, (current: Method[]) => current.filter(item => item.id !== variables.id))
      queryClient.invalidateQueries({ queryKey, refetchType: 'inactive' })
    },
  })

  const sortMutation = useMutation({
    mutationFn: updateMethodOrder,
    onMutate: async sortedMethods => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueriesData({ queryKey })
      queryClient.setQueryData(queryKey, sortedMethods)
      return { previous }
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previous)
    },
    onSuccess: sortedMethods => {
      queryClient.setQueryData(queryKey, () => sortedMethods)
      queryClient.invalidateQueries({ queryKey, refetchType: 'inactive' })
    },
  })

  const addMethod = async (data: MethodFormFields) => addMutation.mutateAsync({ recipeId, data })
  const updateMethod = async (id: string, data: MethodFormFields) => updateMutation.mutateAsync({ id, data })
  const deleteMethod = async (method: Method) => deleteMutation.mutateAsync(method)
  const sortMethods = async (methods: Method[]) => {
    await sortMutation.mutateAsync(methods)
  }

  return { addMethod, updateMethod, deleteMethod, sortMethods }
}

export default function useMethods(recipeId: string) {
  const queryKey = getQueryKey(recipeId)

  const { data: methods } = useQuery({
    queryKey,
    placeholderData: [],
    queryFn: async () => getMethods(recipeId),
    select: useCallback((data: Method[]) => data.sort(sortByOrder), []),
  })

  return methods ?? []
}
