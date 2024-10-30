import { createRecipe, deleteRecipe, getRecipes } from '../../lib/client/recipe'
import { RecipeSchema } from '../../lib/formSchema'
import prisma from '../../lib/prisma'
import { builder } from '../builder'

const recipeType = builder.prismaObject('Recipe', {
  fields: t => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    imageSrc: t.exposeString('imageSrc', { nullable: true }),
    ingredients: t.relation('ingredients'),
    methods: t.relation('methods'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
  }),
})

builder.prismaObject('Ingredient', {
  fields: t => ({
    id: t.exposeID('id'),
    recipeId: t.exposeID('recipeId'),
    name: t.exposeString('name'),
    quantity: t.exposeFloat('quantity', { nullable: true }),
    unit: t.exposeString('unit', { nullable: true }),
  }),
})

builder.prismaObject('Method', {
  fields: t => ({
    id: t.exposeID('id'),
    recipeId: t.exposeID('recipeId'),
    step: t.exposeString('step'),
    stepTime: t.exposeInt('stepTime', { nullable: true }),
  }),
})

const RecipesWithPagination = builder.simpleObject('RecipesWithPagination', {
  fields: t => ({
    totalPages: t.int(),
    recipes: t.field({ type: [recipeType] }),
  }),
})

builder.queryFields(t => ({
  getRecipe: t.prismaField({
    type: 'Recipe',
    args: { id: t.arg.id({ required: true }) },
    nullable: true,
    resolve: async (query, _, { id }) => prisma.recipe.findUnique({ ...query, where: { id } }),
  }),
  getRecipes: t.fieldWithInput({
    type: RecipesWithPagination,
    input: {
      search: t.input.string({ required: false }),
      take: t.input.int({ required: true, defaultValue: 10 }),
      page: t.input.int({ required: true, defaultValue: 1 }),
    },
    resolve: async (_, { input }) => getRecipes({ ...input, searchString: input.search ?? undefined }),
  }),
}))

const createRecipeInput = builder.inputType('CreateRecipeInput', {
  validate: { schema: RecipeSchema },
  fields: t => ({
    name: t.string({ required: true }),
  }),
})

builder.mutationFields(t => ({
  createRecipe: t.prismaField({
    type: 'Recipe',
    args: { input: t.arg({ type: createRecipeInput, required: true }) },
    resolve: async (_, __, { input }) => createRecipe({ ...input }),
  }),
  deleteRecipe: t.prismaField({
    type: 'Recipe',
    nullable: true,
    args: { id: t.arg.id({ required: true }) },
    resolve: async (_, __, { id }) => deleteRecipe(id),
  }),
}))
