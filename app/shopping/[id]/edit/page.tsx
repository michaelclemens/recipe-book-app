'use client'

import useShoppingList from '@/hooks/shopping/useShoppingList'

export default function EditShoppingPage({ params: { id } }: { params: { id: string } }) {
  const list = useShoppingList(id)
  if (!list) return
  return <div>Shopping List {list.name}</div>
}
