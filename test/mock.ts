import { faker } from '@faker-js/faker'
import { Ingredient, Method, Recipe, Unit } from '@prisma/client'
import cuid from 'cuid'

export const createMockRecipe = (): Recipe => ({
  id: cuid(),
  name: faker.food.dish(),
  summary: null,
  prepTime: null,
  cookTime: null,
  serves: null,
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
})

export const createMockIngredients = (recipeId: string, count: number = 1) => {
  const ingredients: Ingredient[] = []
  for (let i = 0; i < count; i++) {
    ingredients.push({
      id: cuid(),
      recipeId,
      name: faker.food.ingredient(),
      prep: null,
      optional: null,
      quantity: faker.helpers.maybe(() => faker.number.int({ min: 1, max: 5 }), { probability: 0.7 }) ?? null,
      unitValue: faker.helpers.maybe(() => faker.number.float({ min: 0.1, max: 1000, multipleOf: 0.25 }), { probability: 0.7 }) ?? null,
      unit: faker.helpers.maybe(() => faker.helpers.enumValue(Unit), { probability: 0.7 }) ?? null,
      order: null,
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    })
  }
  return ingredients
}

export const createMockMethods = (recipeId: string, count: number = 1) => {
  const methods: Method[] = []
  for (let i = 0; i < count; i++) {
    methods.push({
      id: cuid(),
      recipeId,
      step: faker.lorem.sentence({ min: 8, max: 20 }),
      stepTime: faker.helpers.maybe(() => faker.number.int({ min: 1, max: 600, multipleOf: 1 }), { probability: 0.7 }) ?? null,
      order: null,
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    })
  }
  return methods
}
