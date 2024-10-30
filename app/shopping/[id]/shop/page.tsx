import { HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import { prefetchShoppingList } from '@/hooks/shopping/useShoppingList'
import ShopList from '@/components/shop/ShopList'
import Paper from '@/components/ui/Paper'

export default async function ShopPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params

  const { id } = params

  const list = await prefetchShoppingList(id)
  return (
    <Paper className="mx-auto w-full max-w-7xl" lined={false}>
      <HydrationBoundary state={list}>
        <Suspense fallback="Loading...">
          <ShopList listId={id} />
        </Suspense>
      </HydrationBoundary>
    </Paper>
  )
}
