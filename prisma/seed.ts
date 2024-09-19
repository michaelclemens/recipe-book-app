import { createMockIngredients, createMockMethods, createMockRecipe } from '@/test/mock'
import prisma from '@/lib/prisma'
import extraRecipes from './seed-extra'

const emptyDb = async () => {
  await prisma.recipe.deleteMany()
}

const processExtraRecipes = async () => {
  if (!extraRecipes) return

  for (const recipe of extraRecipes) {
    await prisma.recipe.create({
      data: {
        name: recipe.name,
        ingredients: { createMany: { data: recipe.ingredients } },
        methods: { createMany: { data: recipe.methods } },
      },
      include: { ingredients: true, methods: true },
    })
  }
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

    await processExtraRecipes()

    console.log(`Database has been seeded. 🌱`)
  } catch (error) {
    throw error
  }
}

main().catch(err => {
  console.warn('Error While generating Seed: \n', err)
})
