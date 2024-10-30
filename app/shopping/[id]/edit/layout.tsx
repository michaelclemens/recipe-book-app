import { HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import { prefetchList } from '@/hooks/shopping/useList'

export default async function ShoppingLayout(props: {
  params: Promise<{ id: string }>
  children: React.ReactNode
  recipes: React.ReactNode
  items: React.ReactNode
}) {
  const params = await props.params

  const { id } = params

  const { children, recipes, items } = props

  const list = await prefetchList(id)
  return (
    <HydrationBoundary state={list}>
      <main className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden scrollbar scrollbar-track-transparent scrollbar-thumb-neutral-500/50">
        <Suspense fallback="Loading...">{children}</Suspense>
        <div className="flex flex-row">
          <div className="flex w-full flex-col xl:w-1/4">
            <Suspense fallback="Loading...">{recipes}</Suspense>
          </div>
          <div className="flex h-full w-full flex-col overflow-hidden xl:w-3/4">
            <Suspense fallback="Loading...">{items}</Suspense>
          </div>
        </div>
      </main>
    </HydrationBoundary>
  )
}
