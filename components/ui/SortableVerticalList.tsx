'use client'

import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useId } from 'react'
import { RiDraggable } from 'react-icons/ri'
import { sortByOrder } from '@/util/sort'

function SortableItem({ id, children, className = '' }: { id: string; children: React.ReactNode; className?: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className={`${className} group flex w-full snap-start`}>
      <div
        {...listeners}
        {...attributes}
        className="mr-2 text-neutral-950 opacity-0 transition-opacity duration-500 hover:opacity-80 active:cursor-grabbing group-hover:[&:not(:hover)]:opacity-30"
      >
        <RiDraggable title="Move item" />
      </div>
      {children}
    </div>
  )
}

export default function SortableVerticalList({
  items,
  children,
  onSort,
  itemClassName = '',
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: (item: any) => React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSort: (sortedItems: any[]) => Promise<void>
  itemClassName?: string
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
      await onSort(newItems)
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
          <SortableItem key={item.id} id={item.id} className={itemClassName}>
            {children(item)}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  )
}
