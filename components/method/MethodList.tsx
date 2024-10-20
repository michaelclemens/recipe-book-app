'use client'

import { Method } from '@prisma/client'
import useMethods, { useMethodMutations } from '@/hooks/recipe/useMethods'
import { SortableList } from '../ui'
import MethodForm from './MethodForm'

export default function MethodList({ recipeId }: { recipeId: string }) {
  const methods = useMethods(recipeId)
  const { deleteMethod, sortMethods } = useMethodMutations(recipeId)

  return (
    <SortableList items={methods} onSort={sortMethods} className="space-y-7">
      {(method: Method, index: number) => <MethodForm recipeId={method.recipeId} stepNo={++index} method={method} onDelete={deleteMethod} />}
    </SortableList>
  )
}
