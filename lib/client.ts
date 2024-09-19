'use server'

import { Ingredient, Method, Recipe } from '@prisma/client'
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

export const createRecipe = async (data: RecipeFormFields) => {
  let recipe, errors
  try {
    RecipeSchema.parse(data)
    recipe = await prisma.recipe.create({ data })
    revalidatePath('/')
  } catch (error) {
    console.error(error)
    if (error instanceof ZodError) {
      errors = parseZodErrors(error)
    }
  } finally {
    return { recipe, errors }
  }
}

export const getRecipes = async () => {
  try {
    return await prisma.recipe.findMany({ orderBy: { createdAt: 'asc' } })
  } catch (error) {
    console.error(error)
    return []
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

export const addIngredient = async (recipeId: string, data: IngredientFormFields) => {
  let ingredient, errors
  try {
    IngredientSchema.parse(data)
    ingredient = await prisma.ingredient.create({ data: { recipeId, ...data, unit: data.unit ?? undefined } })
  } catch (error) {
    console.error(error)
    if (error instanceof ZodError) {
      errors = parseZodErrors(error)
    }
  } finally {
    return { ingredient, errors }
  }
}

export const updateIngredient = async (id: string, data: IngredientFormFields) => {
  let ingredient, errors
  try {
    IngredientSchema.parse(data)
    ingredient = await prisma.ingredient.update({ where: { id }, data })
  } catch (error) {
    console.error(error)
    if (error instanceof ZodError) {
      errors = parseZodErrors(error)
    }
  } finally {
    return { ingredient, errors }
  }
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

export const addMethod = async (recipeId: string, data: MethodFormFields) => {
  let method, errors
  try {
    MethodSchema.parse(data)
    method = await prisma.method.create({ data: { recipeId, ...data } })
  } catch (error) {
    console.error(error)
    if (error instanceof ZodError) {
      errors = parseZodErrors(error)
    }
  } finally {
    return { method, errors }
  }
}

export const updateMethod = async (id: string, data: MethodFormFields) => {
  let method, errors
  try {
    MethodSchema.parse(data)
    method = await prisma.method.update({ where: { id }, data })
  } catch (error) {
    console.error(error)
    if (error instanceof ZodError) {
      errors = parseZodErrors(error)
    }
  } finally {
    return { method, errors }
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
  } catch (error) {
    console.error(error)
  }
}
