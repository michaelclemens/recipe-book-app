'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Item } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { FaCheck, FaPlus, FaTimes, FaTrashAlt } from 'react-icons/fa'
import { ItemFormFields, ItemSchema } from '@/lib/formSchema'
import { useItemMutations } from '@/hooks/shopping/useItems'
import { PaperInput, PaperRow } from '../ui/Paper'

export default function ItemForm({ listId, item, onDelete }: { listId: string; item?: Item; onDelete?: (item: Item) => Promise<void> }) {
  const {
    handleSubmit,
    register,
    setFocus,
    reset,
    formState: { dirtyFields, errors },
  } = useForm<ItemFormFields>({
    resolver: zodResolver(ItemSchema),
    defaultValues: {
      name: item?.name ?? '',
      quantity: item?.quantity ?? undefined,
      unit: item?.unit ?? undefined,
    },
  })
  const { add, update } = useItemMutations(listId)
  const hasDirtyFields = Object.keys(dirtyFields).length > 0

  const onSubmit = async (data: ItemFormFields) => {
    try {
      const editing = !!item
      editing ? await update(item.id, data) : await add(data)

      if (!editing) {
        reset()
        setFocus('quantity')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <PaperRow>
      <form onSubmit={handleSubmit(onSubmit)} className="group flex w-full gap-2">
        <PaperInput type="number" step={0.1} min={0} className="w-20" placeholder="Qty..." {...register('quantity')} error={errors.quantity} />
        <PaperInput className="w-20" placeholder="Unit..." {...register('unit')} error={errors.unit} />
        <PaperInput className="w-full capitalize" placeholder="Item..." {...register('name')} error={errors.name} />

        <div className="ml-2 flex items-center justify-center gap-2 text-lg opacity-0 transition-opacity delay-100 duration-300 group-hover:opacity-100">
          {item ? (
            <>
              {onDelete && (
                <button type="button" title="Delete item" className="text-red-800" onClick={async () => onDelete(item)}>
                  <FaTrashAlt />
                </button>
              )}
              <button type="submit" title="Update item" className="text-green-800 disabled:opacity-50" disabled={!hasDirtyFields}>
                <FaCheck />
              </button>
            </>
          ) : (
            <>
              <button type="button" title="Clear" className="text-red-800 disabled:opacity-50" onClick={() => reset()} disabled={!hasDirtyFields}>
                <FaTimes />
              </button>
              <button type="submit" title="Add item" className="text-green-800 disabled:opacity-50" disabled={!hasDirtyFields}>
                <FaPlus />
              </button>
            </>
          )}
        </div>
      </form>
    </PaperRow>
  )
}
