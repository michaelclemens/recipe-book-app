/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useId } from 'react'
import { RiDraggable } from 'react-icons/ri'
import { sortByOrder } from '@/util/sort'

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center">
      <div {...listeners} {...attributes} className="mr-2 text-slate-800 transition-colors duration-500 hover:text-slate-400 active:cursor-move">
        <RiDraggable title="Move" size="1.25em" />
      </div>
      {children}
    </div>
  )
}

export default function SortableVerticalList({
  items,
  children,
  onNewSortOrder,
}: {
  items: any[]
  children: (item: any) => React.ReactNode
  onNewSortOrder: (sortedItems: any[]) => Promise<void>
}) {
  const id = useId()
  const sensors = useSensors(useSensor(PointerSensor))

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    if (active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id)
      const newIndex = items.findIndex(item => item.id === over.id)

      const newItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({ ...item, order: index + 1 }))
      await onNewSortOrder(newItems)
    }
  }

  return (
    <DndContext
      id={`dnd-${id}`}
      sensors={sensors}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.sort(sortByOrder).map(item => (
          <SortableItem key={item.id} id={item.id}>
            {children(item)}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  )
}
