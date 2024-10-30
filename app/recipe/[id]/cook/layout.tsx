import { HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import { prefetchRecipe } from '@/hooks/recipe/useRecipe'
import CookTimers from '@/components/cook/CookTimers'

export default async function CookRecipeLayout(props: { params: Promise<{ id: string }>; children: React.ReactNode; ingredients: React.ReactNode }) {
  const params = await props.params

  const { id } = params

  const { children, ingredients } = props

  const recipe = await prefetchRecipe(id)
  return (
    <HydrationBoundary state={recipe}>
      <main className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden scrollbar scrollbar-track-transparent scrollbar-thumb-neutral-500/50 xl:flex-row">
        <div className="flex w-full flex-col xl:w-1/4">
          <div className="h-full w-full xl:h-1/2">
            <Suspense fallback="Loading...">{ingredients}</Suspense>
          </div>
          <div className="h-full w-full xl:h-1/2">
            <Suspense fallback="Loading...">
              <CookTimers />
            </Suspense>
          </div>
        </div>
        <div className="flex h-full w-full flex-col justify-center overflow-hidden xl:w-3/4">
          <Suspense fallback="Loading...">{children}</Suspense>
        </div>
      </main>
    </HydrationBoundary>
  )
}
