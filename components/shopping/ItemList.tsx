'use client'

import useItems, { useItemMutations } from '@/hooks/shopping/useItems'
import { SortableVerticalList } from '../ui'
import ItemForm from './ItemForm'

export default function ItemList({ listId }: { listId: string }) {
  const items = useItems(listId)
  const { sort, remove } = useItemMutations(listId)

  return (
    <div className="z-10 -ml-8 h-full snap-y overflow-y-auto scrollbar scrollbar-track-transparent scrollbar-thumb-neutral-500/50">
      <SortableVerticalList items={items} onSort={sort}>
        {item => <ItemForm listId={item.listId} item={item} onDelete={remove} />}
      </SortableVerticalList>
    </div>
  )
}
