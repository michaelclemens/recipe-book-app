'use client'

import useMethods, { useMethodMutations } from '@/hooks/recipe/useMethods'
import { SortableVerticalList } from '../ui'
import MethodForm from './MethodForm'

export default function MethodList({ recipeId }: { recipeId: string }) {
  const methods = useMethods(recipeId)
  const { deleteMethod, sortMethods } = useMethodMutations(recipeId)

  return (
    <SortableVerticalList items={methods} onSort={sortMethods} className="space-y-7">
      {(method, index) => <MethodForm recipeId={method.recipeId} stepNo={++index} method={method} onDelete={deleteMethod} />}
    </SortableVerticalList>
  )
}
