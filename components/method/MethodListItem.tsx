'use client'

import { Method } from '@prisma/client'
import { useAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { useState } from 'react'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import { methodsAtom } from '@/lib/atom'
import { deleteMethod, updateMethodOrder } from '@/lib/client'
import { Button, SortableVerticalList } from '../ui'
import MethodForm from './MethodForm'

export function MethodListWrapper({ methods: initialMethods }: { methods: Method[] }) {
  useHydrateAtoms([[methodsAtom, initialMethods]])
  const [methods, setMethods] = useAtom(methodsAtom)

  const onNewSortOrder = async (sortedMethods: Method[]) => {
    setMethods(sortedMethods)
    await updateMethodOrder(sortedMethods)
  }

  const onDelete = async (method: Method) => {
    await deleteMethod(method)
    setMethods([...methods.filter(item => item.id !== method.id)])
  }

  return (
    <SortableVerticalList items={methods} onNewSortOrder={onNewSortOrder}>
      {method => (
        <li className="ml-5 w-full">
          <MethodListItem method={method} onDelete={onDelete} />
        </li>
      )}
    </SortableVerticalList>
  )
}

export default function MethodListItem({ method, onDelete }: { method: Method; onDelete: (method: Method) => Promise<void> }) {
  const [editing, setEditing] = useState(false)
  return (
    <div className="ml-1 grid min-h-14 w-full grid-flow-col items-center justify-stretch space-x-2">
      {editing ? (
        <MethodForm recipeId={method.recipeId} method={method} onCloseForm={() => setEditing(false)} />
      ) : (
        <>
          <div className="ml-3 flex-auto">{method.step}</div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-x-2">
              {(method.hour || method.minute) && (
                <div className="flex flex-col items-end">
                  {method.hour && `${method.hour}hr`}
                  {method.minute && ` ${method.minute}min`}
                </div>
              )}
              <Button title="Edit" onClick={() => setEditing(true)}>
                <FaEdit />
              </Button>
              <Button title="Delete" onClick={() => onDelete(method)}>
                <FaTrashAlt />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
