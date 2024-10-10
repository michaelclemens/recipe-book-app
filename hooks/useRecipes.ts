import { Recipe } from '@prisma/client'
import { dehydrate, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { createRecipe, getRecipes, deleteRecipe as clientDeleteRecipe } from '@/lib/client'
import { RecipeFormFields } from '@/lib/formSchema'
import getQueryClient from '@/lib/queryClient'
import { sortByDate } from '@/util/sort'
import useFilterParams from './useFilterParams'

type filterParams = {
  page?: number
  query?: string
}

const getQueryKey = (filter?: filterParams) => ['recipes', filter]

export const prefetchRecipes = async (filter?: filterParams) => {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({ queryKey: getQueryKey(filter), queryFn: async () => getRecipes(filter) })
  return dehydrate(queryClient)
}

export const useRecipeMutations = () => {
  const filter = useFilterParams()
  const queryKey = getQueryKey(filter)
  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: createRecipe,
    onSuccess: newRecipe => {
      queryClient.setQueryData(queryKey, ({ recipes }: { recipes: Recipe[] }) => [...recipes, newRecipe])
      queryClient.invalidateQueries({ queryKey, refetchType: 'inactive' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: clientDeleteRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const addRecipe = async (data: RecipeFormFields) => addMutation.mutateAsync(data)
  const deleteRecipe = async (recipe: Recipe) => deleteMutation.mutateAsync(recipe)

  return { addRecipe, deleteRecipe }
}

export default function useRecipes() {
  const filter = useFilterParams()
  const queryKey = getQueryKey(filter)

  const { data } = useQuery({
    queryKey,
    placeholderData: { recipes: [], totalPages: 1 },
    queryFn: async () => getRecipes(filter),
    select: useCallback((data: { recipes: Recipe[]; totalPages: number }) => {
      data.recipes.sort(sortByDate)
      return data
    }, []),
  })

  return { recipes: data?.recipes ?? [], totalPages: data?.totalPages ?? 1 }
}
