import { createRecipe, deleteRecipe, getRecipes, getRecipe } from '../../lib/client/recipe'
import { RecipeSchema } from '../../lib/formSchema'
import { builder } from '../builder'

const recipeType = builder.prismaObject('Recipe', {
  fields: t => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    imageSrc: t.exposeString('imageSrc', { nullable: true }),
    ingredients: t.relation('ingredients', {
      query: () => ({ orderBy: { order: 'asc' } }),
    }),
    methods: t.relation('methods', {
      query: () => ({ orderBy: { order: 'asc' } }),
    }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
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
    resolve: async (_, __, { id }) => getRecipe(id),
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

const recipeInput = builder.inputType('RecipeInput', {
  validate: { schema: RecipeSchema },
  fields: t => ({
    name: t.string({ required: true }),
  }),
})

builder.mutationFields(t => ({
  createRecipe: t.prismaField({
    type: 'Recipe',
    args: { input: t.arg({ type: recipeInput, required: true }) },
    resolve: async (_, __, { input }) => createRecipe({ ...input }),
  }),
  deleteRecipe: t.prismaField({
    type: 'Recipe',
    nullable: true,
    args: { id: t.arg.id({ required: true }) },
    resolve: async (_, __, { id }) => deleteRecipe(id),
  }),
}))
