import { HydrationBoundary } from '@tanstack/react-query'
import { prefetchItems } from '@/hooks/shopping/useItems'
import ItemForm from '@/components/shopping/ItemForm'
import ItemList from '@/components/shopping/ItemList'
import Paper, { PaperRow } from '@/components/ui/Paper'

export default async function ItemsPage({ params: { id } }: { params: { id: string } }) {
  const items = await prefetchItems(id)
  return (
    <div className="flex flex-col overflow-hidden">
      <Paper>
        <PaperRow className="mb-7 underline underline-offset-4">Items</PaperRow>
        <ItemForm listId={id} />
        <HydrationBoundary state={items}>
          <ItemList listId={id} />
        </HydrationBoundary>
      </Paper>
    </div>
  )
}
