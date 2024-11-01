import { HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import { prefetchRecipe } from '@/hooks/recipe/useRecipe'

export default async function RecipeLayout(props: {
  params: Promise<{ id: string }>
  children: React.ReactNode
  ingredients: React.ReactNode
  methods: React.ReactNode
}) {
  const params = await props.params
  const { id } = params
  const { children, ingredients, methods } = props
  const recipe = await prefetchRecipe(id)

  return (
    <main className="mt-5 flex h-full w-full flex-grow flex-col overflow-y-auto pt-5 xl:overflow-hidden">
      <HydrationBoundary state={recipe}>
        <Suspense fallback="Loading...">{children}</Suspense>
      </HydrationBoundary>
      <div className="grid h-full grid-cols-1 px-5 pt-5 xl:grid-cols-5 xl:overflow-hidden">
        <Suspense fallback="Loading...">{ingredients}</Suspense>
        <Suspense fallback="Loading...">{methods}</Suspense>
      </div>
    </main>
  )
}
