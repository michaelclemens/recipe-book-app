'use server'

import { Prisma } from '@prisma/client'
import { notFound } from 'next/navigation'
import { ZodError } from 'zod'
import { IngredientFormFields, IngredientSchema, MethodFormFields, MethodSchema, RecipeFormFields, RecipeSchema } from '../formSchema'
import prisma from '../prisma'

const parseZodErrors = (error: ZodError) => {
  const errors = []
  const fieldErrors = error.flatten().fieldErrors
  for (const path of Object.keys(fieldErrors)) {
    errors.push({ path, message: fieldErrors[path]?.join(', ') })
  }
  return errors
}

export const createRecipe = async (data: RecipeFormFields) => {
  try {
    RecipeSchema.parse(data)
    return prisma.recipe.create({ data })
  } catch (error) {
    console.error(error)
    if (error instanceof ZodError) {
      throw parseZodErrors(error)
    }
    throw error
  }
}

export const getRecipes = async ({ searchString, page, take = 10 }: { searchString?: string; page?: number; take?: number } = {}) => {
  const where: Prisma.RecipeWhereInput = {}
  if (searchString) {
    where.name = { contains: searchString, mode: 'insensitive' }
  }
  try {
    const [count, recipes] = await prisma.$transaction([
      prisma.recipe.count({ where }),
      prisma.recipe.findMany({
        where,
        skip: page && page > 1 ? (page - 1) * take : undefined,
        orderBy: { createdAt: 'asc' },
        take,
      }),
    ])
    const totalPages = Math.ceil(count / take)
    return { recipes, totalPages }
  } catch (error) {
    console.error(error)
    return { recipes: [], totalPages: 0 }
  }
}

export const getRecipe = async (id: string) => {
  try {
    return await prisma.recipe.findUniqueOrThrow({ where: { id } })
  } catch (error) {
    console.error(error)
    return notFound()
  }
}

export const deleteRecipe = async (id: string) => {
  try {
    return await prisma.recipe.delete({ where: { id } })
  } catch (error) {
    console.error(error)
  }
}

export const getIngredients = async (recipeId: string) => {
  try {
    return await prisma.ingredient.findMany({ where: { recipeId } })
  } catch (error) {
    console.error(error)
    return []
  }
}

export const addIngredient = async ({ recipeId, data }: { recipeId: string; data: IngredientFormFields }) => {
  IngredientSchema.parse(data)
  return prisma.ingredient.create({ data: { recipeId, ...data, unit: data.unit ?? undefined } })
}

export const updateIngredient = async ({ id, data }: { id: string; data: IngredientFormFields }) => {
  IngredientSchema.parse(data)
  return prisma.ingredient.update({ where: { id }, data })
}

export const deleteIngredient = async (id: string) => {
  try {
    return await prisma.ingredient.delete({ where: { id } })
  } catch (error) {
    console.error(error)
  }
}

export const updateIngredientOrder = async (data: { id: string; order?: number | null }[]) => {
  const ingredients = []
  try {
    for (const { id, order } of data) {
      const ingredient = await prisma.ingredient.update({ where: { id }, data: { order } })
      ingredients.push(ingredient)
    }
  } catch (error) {
    console.error(error)
  } finally {
    return ingredients
  }
}

export const getMethods = async (recipeId: string) => {
  try {
    return await prisma.method.findMany({ where: { recipeId } })
  } catch (error) {
    console.error(error)
    return []
  }
}

export const addMethod = async ({ recipeId, data }: { recipeId: string; data: MethodFormFields }) => {
  try {
    MethodSchema.parse(data)
    return prisma.method.create({ data: { recipeId, ...data } })
  } catch (error) {
    console.error(error)
    if (error instanceof ZodError) {
      throw parseZodErrors(error)
    }
    throw error
  }
}

export const updateMethod = async ({ id, data }: { id: string; data: MethodFormFields }) => {
  try {
    MethodSchema.parse(data)
    return prisma.method.update({ where: { id }, data })
  } catch (error) {
    console.error(error)
    if (error instanceof ZodError) {
      throw parseZodErrors(error)
    }
    throw error
  }
}

export const deleteMethod = async (id: string) => {
  try {
    return await prisma.method.delete({ where: { id } })
  } catch (error) {
    console.error(error)
  }
}

export const updateMethodOrder = async (data: { id: string; order?: number | null }[]) => {
  const methods = []
  try {
    for (const { id, order } of data) {
      const method = await prisma.method.update({ where: { id }, data: { order } })
      methods.push(method)
    }
  } catch (error) {
    console.error(error)
  } finally {
    return methods
  }
}
