'use client'

import useMethods, { useMethodMutations } from '@/hooks/useMethods'
import { SortableVerticalList } from '../ui'
import MethodForm from './MethodForm'

export default function MethodList({ recipeId }: { recipeId: string }) {
  const methods = useMethods(recipeId)
  const { deleteMethod, sortMethods } = useMethodMutations(recipeId)

  return (
    <ol className="z-10 -ml-8 snap-y list-decimal space-y-7 overflow-y-auto scrollbar scrollbar-track-transparent scrollbar-thumb-neutral-500/50">
      <SortableVerticalList items={methods} onSort={sortMethods}>
        {method => (
          <li key={method.id} className="ml-8 w-full">
            <MethodForm recipeId={method.recipeId} method={method} onDelete={deleteMethod} />
          </li>
        )}
      </SortableVerticalList>
    </ol>
  )
}
