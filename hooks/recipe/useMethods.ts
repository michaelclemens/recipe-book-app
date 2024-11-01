import { getFragmentData } from '@/graphql/generated'
import {
  AddMethodDocument,
  DeleteMethodDocument,
  GetMethodsDocument,
  GetMethodsQuery,
  MethodFragmentFragment,
  MethodFragmentFragmentDoc,
  SortMethodsDocument,
  UpdateMethodDocument,
} from '@/graphql/generated/graphql'
import { dehydrate, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MethodFormFields } from '@/lib/formSchema'
import getGraphQLClient from '@/lib/graphQLClient'
import getQueryClient from '@/lib/queryClient'

const graphQLClient = getGraphQLClient()
const getQueryKey = (recipeId: string) => ['recipeMethods', recipeId]

export const prefetchMethods = async (recipeId: string) => {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({ queryKey: getQueryKey(recipeId), queryFn: async () => graphQLClient.request(GetMethodsDocument, { recipeId }) })
  return dehydrate(queryClient)
}

export const useMethodMutations = (recipeId: string) => {
  const queryKey = getQueryKey(recipeId)
  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: async ({ recipeId, data }: { recipeId: string; data: MethodFormFields }) =>
      graphQLClient.request(AddMethodDocument, { recipeId, input: data }),
    onSuccess: ({ addMethod }) => {
      const ingredient = getFragmentData(MethodFragmentFragmentDoc, addMethod)
      queryClient.setQueryData(queryKey, (current: GetMethodsQuery) => ({
        ...current,
        getRecipe: { methods: [...getFragmentData(MethodFragmentFragmentDoc, current.getRecipe?.methods ?? []), ingredient] },
      }))
      queryClient.invalidateQueries({ queryKey, refetchType: 'inactive' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: MethodFormFields }) => graphQLClient.request(UpdateMethodDocument, { id, input: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey, refetchType: 'inactive' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => graphQLClient.request(DeleteMethodDocument, { id }),
    onSuccess: (_, id) => {
      queryClient.setQueryData(queryKey, (current: GetMethodsQuery) => ({
        ...current,
        getRecipe: {
          methods: getFragmentData(MethodFragmentFragmentDoc, current.getRecipe?.methods ?? []).filter(item => item.id !== id),
        },
      }))
      queryClient.invalidateQueries({ queryKey, refetchType: 'inactive' })
    },
  })

  const sortMutation = useMutation({
    mutationFn: async (methods: MethodFragmentFragment[]) =>
      graphQLClient.request(SortMethodsDocument, { input: methods.map(method => ({ id: method.id, order: method.order })) }),
    onMutate: async sortedMethods => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueriesData({ queryKey })
      queryClient.setQueryData(queryKey, (current: GetMethodsQuery) => ({
        ...current,
        getRecipe: { methods: sortedMethods },
      }))
      return { previous }
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previous)
    },
    onSuccess: ({ sortMethods }) => {
      queryClient.setQueryData(queryKey, (current: GetMethodsQuery) => ({
        ...current,
        getRecipe: { methods: sortMethods },
      }))
      queryClient.invalidateQueries({ queryKey, refetchType: 'inactive' })
    },
  })

  const addMethod = async (data: MethodFormFields) => addMutation.mutateAsync({ recipeId, data })
  const updateMethod = async (id: string, data: MethodFormFields) => updateMutation.mutateAsync({ id, data })
  const deleteMethod = async (method: MethodFragmentFragment) => deleteMutation.mutateAsync(method.id)
  const sortMethods = async (methods: MethodFragmentFragment[]) => {
    await sortMutation.mutateAsync(methods)
  }

  return { addMethod, updateMethod, deleteMethod, sortMethods }
}

export default function useMethods(recipeId: string) {
  const queryKey = getQueryKey(recipeId)

  const { data } = useQuery({
    queryKey,
    queryFn: async () => graphQLClient.request(GetMethodsDocument, { recipeId }),
  })

  return getFragmentData(MethodFragmentFragmentDoc, data?.getRecipe?.methods ?? [])
}
