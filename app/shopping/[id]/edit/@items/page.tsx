import { HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import { prefetchItems } from '@/hooks/shopping/useItems'
import { prefetchListRecipes } from '@/hooks/shopping/useListRecipes'
import ItemForm from '@/components/shopping/ItemForm'
import ItemList from '@/components/shopping/ItemList'
import ListRecipes from '@/components/shopping/ListRecipes'
import Paper from '@/components/ui/Paper'

export default async function ItemsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params

  const { id } = params

  const items = await prefetchItems(id)
  const recipes = await prefetchListRecipes(id)
  return (
    <div className="flex flex-col overflow-hidden">
      <Paper>
        <div className="mb-7 underline underline-offset-4">Items</div>
        <ItemForm listId={id} />
        <HydrationBoundary state={items}>
          <Suspense fallback="Loading...">
            <ItemList listId={id} />
          </Suspense>
        </HydrationBoundary>
        <div className="my-7 underline underline-offset-4">Recipes</div>
        <HydrationBoundary state={recipes}>
          <Suspense fallback="Loading...">
            <ListRecipes listId={id} />
          </Suspense>
        </HydrationBoundary>
      </Paper>
    </div>
  )
}
