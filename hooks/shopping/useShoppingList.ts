import { dehydrate, useQuery } from '@tanstack/react-query'
import { getShoppingList } from '@/lib/client/shopping'
import getQueryClient from '@/lib/queryClient'

const getQueryKey = (listId: string) => ['shoppingList', listId]

export const prefetchShoppingList = async (listId: string) => {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({ queryKey: getQueryKey(listId), queryFn: async () => getShoppingList(listId) })
  return dehydrate(queryClient)
}

export default function useShoppingList(listId: string) {
  const { data: list } = useQuery({
    queryKey: getQueryKey(listId),
    queryFn: async () => getShoppingList(listId),
  })

  return list
}
