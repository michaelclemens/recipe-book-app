'use server'

import { Item } from '@prisma/client'
import { notFound, redirect } from 'next/navigation'
import { ItemFormFields, ItemSchema } from '../formSchema'
import prisma from '../prisma'

export const createShoppingListAction = async (formData: FormData) => {
  const name = formData.get('name')?.toString()
  if (!name) return
  const list = await prisma.list.create({ data: { name } })
  redirect(`/shopping/${list.id}/edit`)
}

export const getShoppingList = async (id: string) => {
  try {
    return await prisma.list.findUniqueOrThrow({ where: { id } })
  } catch (error) {
    console.error(error)
    return notFound()
  }
}

export const getItems = async (listId: string) => {
  try {
    return await prisma.item.findMany({ where: { listId } })
  } catch (error) {
    console.error(error)
    return []
  }
}

export const addItem = async ({ listId, data }: { listId: string; data: ItemFormFields }) => {
  ItemSchema.parse(data)
  return prisma.item.create({ data: { listId, ...data, unit: data.unit ?? undefined } })
}

export const updateItem = async ({ id, data }: { id: string; data: ItemFormFields }) => {
  ItemSchema.parse(data)
  return prisma.item.update({ where: { id }, data })
}

export const deleteItem = async (item: Item) => {
  try {
    await prisma.item.delete({ where: { id: item.id } })
  } catch (error) {
    console.error(error)
  }
}

export const updateItemOrder = async (items: Item[]) => {
  try {
    for (const item of items) {
      await prisma.item.update({ where: { id: item.id }, data: { order: item.order } })
    }
    return items
  } catch (error) {
    console.error(error)
  }
}
