import { HydrationBoundary } from '@tanstack/react-query'
import { prefetchRecipe } from '@/hooks/useRecipe'
import CookTimers from '@/components/cook/CookTimers'

export default async function CookRecipeLayout({
  params: { id },
  children,
  ingredients,
}: {
  params: { id: string }
  children: React.ReactNode
  ingredients: React.ReactNode
}) {
  const recipe = await prefetchRecipe(id)
  return (
    <HydrationBoundary state={recipe}>
      <main className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden scrollbar scrollbar-track-transparent scrollbar-thumb-neutral-500/50 xl:flex-row">
        <div className="flex w-full flex-col xl:w-1/4">
          <div className="h-full w-full xl:h-1/2">{ingredients}</div>
          <div className="h-full w-full xl:h-1/2">
            <CookTimers />
          </div>
        </div>
        <div className="flex h-full w-full flex-col justify-center xl:w-3/4">
          <div className="flex h-full w-full flex-col overflow-hidden">{children}</div>
        </div>
      </main>
    </HydrationBoundary>
  )
}
