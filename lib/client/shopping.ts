'use server'

import { Item, List, Prisma, Recipe } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import { ItemFormFields, ItemSchema } from '../formSchema'
import prisma from '../prisma'

export const createListAction = async (formData: FormData) => {
  const name = formData.get('name')?.toString()
  if (!name) return
  const list = await prisma.list.create({ data: { name } })
  redirect(`/shopping/${list.id}/edit`)
}

export const getList = async (id: string) => {
  try {
    return await prisma.list.findUniqueOrThrow({ where: { id } })
  } catch (error) {
    console.error(error)
    return notFound()
  }
}

export const getLists = async ({ query, page, limit = 10 }: { query?: string; page?: number; limit?: number } = {}) => {
  const where: Prisma.ListWhereInput = {}
  if (query) {
    where.name = { contains: query, mode: 'insensitive' }
  }
  try {
    const [count, lists] = await prisma.$transaction([
      prisma.list.count({ where }),
      prisma.list.findMany({
        where,
        skip: page && page > 1 ? (page - 1) * limit : undefined,
        orderBy: { createdAt: 'asc' },
        take: limit,
      }),
    ])

    const totalPages = Math.ceil(count / limit)
    return { lists, totalPages }
  } catch (error) {
    console.error(error)
    return { lists: [], totalPages: 0 }
  }
}

export const deleteList = async (list: List) => {
  try {
    await prisma.list.delete({ where: { id: list.id } })
    revalidatePath('/shopping')
  } catch (error) {
    console.error(error)
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

export const getListRecipes = async (listId: string) => {
  try {
    const { recipes } = await prisma.list.findUniqueOrThrow({ where: { id: listId }, include: { recipes: true } })
    return recipes
  } catch (error) {
    console.error(error)
    return []
  }
}

export const addListRecipe = async ({ listId, recipe }: { listId: string; recipe: Recipe }) => {
  await prisma.list.update({ where: { id: listId }, data: { recipes: { connect: recipe } } })
  return recipe
}

export const deleteListRecipe = async ({ listId, recipe }: { listId: string; recipe: Recipe }) => {
  try {
    await prisma.list.update({ where: { id: listId }, data: { recipes: { delete: recipe } } })
  } catch (error) {
    console.error(error)
  }
}

export const getShoppingList = async (listId: string) => {
  try {
    return prisma.list.findUniqueOrThrow({ where: { id: listId }, include: { recipes: { include: { ingredients: true } }, items: true } })
  } catch (error) {
    console.error(error)
    return notFound()
  }
}
