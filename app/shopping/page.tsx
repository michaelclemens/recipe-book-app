import { HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import { createListAction } from '@/lib/client/shopping'
import { prefetchLists } from '@/hooks/shopping/useLists'
import ShoppingList from '@/components/shopping/ShoppingList'

export default async function ShoppingHome({ searchParams }: { searchParams?: { query?: string; page?: string } }) {
  const query = searchParams?.query || undefined
  const page = Number(searchParams?.page) || undefined

  const lists = await prefetchLists({ query, page })
  return (
    <main className="h-full w-full xl:px-10">
      <form action={createListAction} className="flex flex-col gap-y-10">
        <input name="name" placeholder="Shopping list name..." className="text-neutral-950" required />
        <button>Create shopping list</button>
      </form>
      <div className="flex h-full flex-col">
        <HydrationBoundary state={lists}>
          <Suspense fallback="Loading...">
            <ShoppingList />
          </Suspense>
        </HydrationBoundary>
      </div>
    </main>
  )
}
