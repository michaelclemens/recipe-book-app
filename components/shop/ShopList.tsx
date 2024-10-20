'use client'

import { Checkbox, Field, Label } from '@headlessui/react'
import { Ingredient, Item } from '@prisma/client'
import { Caveat } from 'next/font/google'
import { FaCheck } from 'react-icons/fa'
import useShoppingList from '@/hooks/shopping/useShoppingList'

const caveat = Caveat({ subsets: ['latin'] })

const ListRow = ({ item }: { item: Item | Ingredient }) => {
  return (
    <Field className="flex items-center">
      <Checkbox
        defaultChecked={false}
        className="group peer mr-2 size-5 rounded-md p-1 ring-1 ring-inset ring-neutral-950/30 data-[checked]:bg-green-600/80 data-[checked]:ring-neutral-950/60 focus-visible:outline-none"
      >
        <FaCheck className="size-3 text-white opacity-0 transition-opacity duration-150 group-data-[checked]:opacity-100" />
      </Checkbox>
      <Label className="flex grow cursor-pointer items-center gap-2 transition-opacity duration-150 peer-data-[checked]:line-through peer-data-[checked]:opacity-50">
        {item.quantity && <div>{item.quantity}</div>}
        {item.unit && <div>{item.unit}</div>}
        <div className="truncate px-1 capitalize" title={item.name}>
          {item.name}
        </div>
      </Label>
    </Field>
  )
}

export default function ShopList({ listId }: { listId: string }) {
  const list = useShoppingList(listId)
  if (!list) return

  return (
    <div
      className={`${caveat.className} mb-10 mt-5 flex h-full snap-y flex-row flex-wrap gap-8 overflow-y-auto pl-1 pr-2 text-3xl scrollbar scrollbar-track-transparent scrollbar-thumb-neutral-500/50`}
    >
      {list.recipes.map(recipe => (
        <div key={recipe.id} className="mb-2 flex snap-start flex-col">
          <div className="mb-1 underline underline-offset-4">{recipe.name}</div>
          {recipe.ingredients.map(ingredient => (
            <ListRow key={ingredient.id} item={ingredient} />
          ))}
        </div>
      ))}
      <div className="flex w-full flex-col border-t-2 border-dashed border-t-neutral-950/15 pt-2">
        {list.items.map(item => (
          <ListRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
