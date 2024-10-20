'use client'

import Link from 'next/link'
import useLists, { useListMutations } from '@/hooks/shopping/useLists'

export default function ShoppingList() {
  const { lists } = useLists()
  const { remove } = useListMutations()
  return (
    <>
      {lists.map(list => (
        <div key={list.id}>
          {list.name}
          <Link href={`/shopping/${list.id}/shop`}>Let&apos;s Shop!</Link>
          <Link href={`/shopping/${list.id}/edit`}>Edit</Link>
          <button onClick={async () => remove(list)}>Delete</button>
        </div>
      ))}
    </>
  )
}
