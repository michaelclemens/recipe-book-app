'use server'

import { Ingredient, Method, Recipe, Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'
import { ZodError } from 'zod'
import { IngredientFormFields, IngredientSchema, MethodFormFields, MethodSchema, RecipeFormFields, RecipeSchema } from './formSchema'
import prisma from './prisma'

const parseZodErrors = (error: ZodError) => {
  const errors = []
  const fieldErrors = error.flatten().fieldErrors
  for (const path of Object.keys(fieldErrors)) {
    errors.push({ path, message: fieldErrors[path]?.join(', ') })
  }
  return errors
}

export type RecipeFull = RecipeFormFields & { ingredients: IngredientFormFields[]; methods: MethodFormFields[] }

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

export const getRecipes = async ({ query, page, limit = 10 }: { query?: string; page?: number; limit?: number } = {}) => {
  const where: Prisma.RecipeWhereInput = {}
  if (query) {
    where.name = { contains: query, mode: 'insensitive' }
  }
  try {
    const [count, recipes] = await prisma.$transaction([
      prisma.recipe.count({ where }),
      prisma.recipe.findMany({
        where,
        skip: page && page > 1 ? (page - 1) * limit : undefined,
        orderBy: { createdAt: 'asc' },
        take: limit,
      }),
    ])

    const totalPages = Math.ceil(count / limit)
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

export const deleteRecipe = async (recipe: Recipe) => {
  try {
    await prisma.recipe.delete({ where: { id: recipe.id } })
    revalidatePath('/')
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

export const deleteIngredient = async (ingredient: Ingredient) => {
  try {
    await prisma.ingredient.delete({ where: { id: ingredient.id } })
  } catch (error) {
    console.error(error)
  }
}

export const updateIngredientOrder = async (ingredients: Ingredient[]) => {
  try {
    for (const ingredient of ingredients) {
      await prisma.ingredient.update({ where: { id: ingredient.id }, data: { order: ingredient.order } })
    }
    return ingredients
  } catch (error) {
    console.error(error)
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

export const deleteMethod = async (method: Method) => {
  try {
    await prisma.method.delete({ where: { id: method.id } })
  } catch (error) {
    console.error(error)
  }
}

export const updateMethodOrder = async (methods: Method[]) => {
  try {
    for (const method of methods) {
      await prisma.method.update({ where: { id: method.id }, data: { order: method.order } })
    }
    return methods
  } catch (error) {
    console.error(error)
  }
}
