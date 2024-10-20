'use client'

import useList from '@/hooks/shopping/useList'

export default function EditShoppingPage({ params: { id } }: { params: { id: string } }) {
  const list = useList(id)
  if (!list) return
  return <div>Shopping List {list.name}</div>
}
