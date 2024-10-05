'use client'

import { Method } from '@prisma/client'
import { useAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { methodsAtom } from '@/lib/atom'
import { deleteMethod, updateMethodOrder } from '@/lib/client'
import { SortableVerticalList } from '../ui'
import MethodForm from './MethodForm'

export default function MethodList({ methods: initialMethods }: { methods: Method[] }) {
  useHydrateAtoms([[methodsAtom, initialMethods]])
  const [methods, setMethods] = useAtom(methodsAtom)

  const onDelete = async (method: Method) => {
    await deleteMethod(method)
    setMethods([...methods.filter(item => item.id !== method.id)])
  }

  const onSort = async (sortedMethods: Method[]) => {
    setMethods(sortedMethods)
    await updateMethodOrder(sortedMethods)
  }

  return (
    <ol className="z-10 -ml-8 snap-y list-decimal space-y-7 overflow-y-auto scrollbar scrollbar-track-transparent scrollbar-thumb-neutral-500/50">
      <SortableVerticalList items={methods} onSort={onSort}>
        {method => (
          <li key={method.id} className="ml-8 w-full">
            <MethodForm recipeId={method.recipeId} method={method} onDelete={onDelete} />
          </li>
        )}
      </SortableVerticalList>
    </ol>
  )
}
