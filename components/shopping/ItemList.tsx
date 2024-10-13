'use client'

import useItems, { useItemMutations } from '@/hooks/shopping/useItems'
import { SortableVerticalList } from '../ui'
import ItemForm from './ItemForm'

export default function ItemList({ listId }: { listId: string }) {
  const items = useItems(listId)
  const { sort, remove } = useItemMutations(listId)

  return (
    <SortableVerticalList items={items} onSort={sort}>
      {item => <ItemForm listId={item.listId} item={item} onDelete={remove} />}
    </SortableVerticalList>
  )
}
