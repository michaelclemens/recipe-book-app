'use client'

import { Reorder, useDragControls, useMotionValue } from 'framer-motion'
import { useEffect, useState } from 'react'
import { RiDraggable } from 'react-icons/ri'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ItemType = any

const SortableItem = ({ item, children, onDragEnd }: { item: ItemType; children: React.ReactNode; onDragEnd: (item: ItemType) => Promise<void> }) => {
  const y = useMotionValue(0)
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      className={`group flex w-full snap-start`}
      value={item}
      id={item.id}
      style={{ y }}
      dragListener={false}
      dragControls={dragControls}
      onDragEnd={() => onDragEnd(item)}
    >
      <div
        className="mr-2 cursor-grab text-neutral-950 opacity-0 transition-opacity duration-500 hover:opacity-80 active:cursor-grabbing active:select-none group-hover:[&:not(:hover)]:opacity-30"
        onPointerDown={event => dragControls.start(event)}
      >
        <RiDraggable title="Move item" />
      </div>
      {children}
    </Reorder.Item>
  )
}

export default function SortableList({
  items: initialItems,
  children,
  onSort,
  className = '',
}: {
  items: ItemType[]
  children: (item: ItemType, index: number) => React.ReactNode
  onSort: (sortedItems: ItemType[]) => Promise<ItemType[] | undefined>
  className?: string
}) {
  const [items, setItems] = useState(initialItems)

  useEffect(() => {
    if (initialItems.length !== items.length) {
      setItems(initialItems)
    }
  }, [initialItems, items])

  const onDragEnd = async (item: ItemType) => {
    const oldIndex = initialItems.findIndex(({ id }) => id === item.id)
    const newIndex = items.findIndex(({ id }) => id === item.id)
    if (oldIndex !== newIndex) {
      await onSort(items.map((item, index) => ({ ...item, order: index + 1 })))
    }
  }

  return (
    <Reorder.Group
      axis="y"
      onReorder={setItems}
      values={items}
      layoutScroll
      className={`scrollbar scrollbar-track-transparent scrollbar-thumb-neutral-500/50 z-10 -ml-8 h-full snap-y overflow-y-auto ${className}`}
    >
      {items.map((item, index) => (
        <SortableItem key={item.id} item={item} onDragEnd={onDragEnd}>
          {children(item, index)}
        </SortableItem>
      ))}
    </Reorder.Group>
  )
}
