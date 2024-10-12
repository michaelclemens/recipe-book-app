import { HydrationBoundary } from '@tanstack/react-query'
import { prefetchShoppingList } from '@/hooks/shopping/useShoppingList'

export default async function ShoppingLayout({
  params: { id },
  children,
  items,
}: {
  params: { id: string }
  children: React.ReactNode
  items: React.ReactNode
}) {
  const list = await prefetchShoppingList(id)
  return (
    <HydrationBoundary state={list}>
      <main className="-mt-5 flex h-full w-full flex-grow flex-col overflow-hidden pt-5">
        {children}
        <div className="h-full overflow-hidden p-5">{items}</div>
      </main>
    </HydrationBoundary>
  )
}
