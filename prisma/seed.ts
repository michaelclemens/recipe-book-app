import { createMockIngredients, createMockMethods, createMockRecipe } from '@/test/mock'
import prisma from '@/lib/prisma'

const emptyDb = async () => {
  await prisma.recipe.deleteMany()
}

const main = async () => {
  try {
    await emptyDb()

    const recipe = createMockRecipe()
    await prisma.recipe.create({ data: recipe })

    const ingredients = createMockIngredients(recipe.id, 10)
    await prisma.ingredient.createMany({ data: ingredients })

    const methods = createMockMethods(recipe.id, 5)
    await prisma.method.createMany({ data: methods })

    console.log(`Database has been seeded. 🌱`)
  } catch (error) {
    throw error
  }
}

main().catch(err => {
  console.warn('Error While generating Seed: \n', err)
})
