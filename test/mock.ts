import { faker } from '@faker-js/faker'
import { Ingredient, Method, Recipe, Unit } from '@prisma/client'
import cuid from 'cuid'

export const createMockRecipe = (): Recipe => ({
  id: cuid(),
  name: faker.food.dish(),
  imageSrc: faker.image.urlLoremFlickr({ category: 'food,meal,dish', width: 1280, height: 800 }),
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
    const unitValue = faker.helpers.maybe(() => faker.number.float({ min: 1, max: 500, multipleOf: 0.5 }), { probability: 0.7 }) ?? null
    ingredients.push({
      id: cuid(),
      recipeId,
      name: faker.food.ingredient(),
      prep: null,
      optional: null,
      quantity: unitValue
        ? (faker.helpers.maybe(() => faker.number.int({ min: 1, max: 5 }), { probability: 0.7 }) ?? null)
        : faker.number.int({ min: 1, max: 5 }),
      unitValue,
      unit: unitValue ? faker.helpers.enumValue(Unit) : null,
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
