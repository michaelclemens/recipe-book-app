import { Item } from '@prisma/client'
import { dehydrate, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { addItem, deleteItem, getItems, updateItem, updateItemOrder } from '@/lib/client/shopping'
import { ItemFormFields } from '@/lib/formSchema'
import getQueryClient from '@/lib/queryClient'
import { sortByOrder } from '@/util/sort'

const getQueryKey = (listId: string) => ['shoppingListItems', listId]

export const prefetchItems = async (listId: string) => {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({ queryKey: getQueryKey(listId), queryFn: async () => getItems(listId) })
  return dehydrate(queryClient)
}

export const useItemMutations = (listId: string) => {
  const queryKey = getQueryKey(listId)
  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: addItem,
    onSuccess: item => {
      queryClient.setQueryData(queryKey, (current: Item[]) => [...current, item])
      queryClient.invalidateQueries({ queryKey, refetchType: 'inactive' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateItem,
    onSuccess: item => {
      queryClient.setQueryData(queryKey, (current: Item[]) => current.map(obj => (obj.id === item.id ? item : obj)))
      queryClient.invalidateQueries({ queryKey, refetchType: 'inactive' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(queryKey, (current: Item[]) => current.filter(item => item.id !== variables.id))
      queryClient.invalidateQueries({ queryKey, refetchType: 'inactive' })
    },
  })

  const sortMutation = useMutation({
    mutationFn: updateItemOrder,
    onMutate: async items => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueriesData({ queryKey })
      queryClient.setQueryData(queryKey, items)
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

  const add = async (data: ItemFormFields) => addMutation.mutateAsync({ listId, data })
  const update = async (id: string, data: ItemFormFields) => updateMutation.mutateAsync({ id, data })
  const remove = async (item: Item) => deleteMutation.mutateAsync(item)
  const sort = async (item: Item[]) => {
    sortMutation.mutateAsync(item)
  }

  return { add, update, remove, sort }
}

export default function useItems(listId: string) {
  const queryKey = getQueryKey(listId)

  const { data: items } = useQuery({
    queryKey,
    placeholderData: [],
    queryFn: async () => getItems(listId),
    select: useCallback((data: Item[]) => data.sort(sortByOrder), []),
  })

  return items ?? []
}
