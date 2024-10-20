import { dehydrate, useQuery } from '@tanstack/react-query'
import { getList } from '@/lib/client/shopping'
import getQueryClient from '@/lib/queryClient'

const getQueryKey = (listId: string) => ['list', listId]

export const prefetchList = async (listId: string) => {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({ queryKey: getQueryKey(listId), queryFn: async () => getList(listId) })
  return dehydrate(queryClient)
}

export default function useList(listId: string) {
  const { data: list } = useQuery({
    queryKey: getQueryKey(listId),
    queryFn: async () => getList(listId),
  })

  return list
}
