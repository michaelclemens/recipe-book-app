import { List } from '@prisma/client'
import { dehydrate, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { deleteList, getLists } from '@/lib/client/shopping'
import getQueryClient from '@/lib/queryClient'
import { sortByDate } from '@/util/sort'
import useFilterParams from '../useFilterParams'

type filterParams = {
  page?: number
  query?: string
}

const getQueryKey = (filter?: filterParams) => ['lists', filter]

export const prefetchLists = async (filter?: filterParams) => {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({ queryKey: getQueryKey(filter), queryFn: async () => getLists(filter) })
  return dehydrate(queryClient)
}

export const useListMutations = () => {
  const { filter } = useFilterParams()
  const queryKey = getQueryKey(filter)
  const queryClient = useQueryClient()

  // const addMutation = useMutation({
  //   mutationFn: createRecipe,
  //   onSuccess: list => {
  //     queryClient.setQueryData(queryKey, ({ lists }: { lists: List[] }) => [...lists, list])
  //     queryClient.invalidateQueries({ queryKey, refetchType: 'inactive' })
  //   },
  // })

  const deleteMutation = useMutation({
    mutationFn: deleteList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  // const addRecipe = async (data: RecipeFormFields) => addMutation.mutateAsync(data)
  const remove = async (list: List) => deleteMutation.mutateAsync(list)

  return {
    // addRecipe,
    remove,
  }
}

export default function useLists() {
  const { filter } = useFilterParams()
  const queryKey = getQueryKey(filter)

  const { data } = useQuery({
    queryKey,
    placeholderData: { lists: [], totalPages: 1 },
    queryFn: async () => getLists(filter),
    select: useCallback((data: { lists: List[]; totalPages: number }) => {
      data.lists.sort(sortByDate)
      return data
    }, []),
  })

  return { lists: data?.lists ?? [], totalPages: data?.totalPages ?? 1 }
}
