import SchemaBuilder from '@pothos/core'
import PrismaPlugin from '@pothos/plugin-prisma'
import type PrismaTypes from '@pothos/plugin-prisma/generated'
import prisma from '../lib/prisma'

// import { createRecipe } from './client/recipe'

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
})

builder.queryType({})
builder.mutationType({})

builder.prismaObject('Recipe', {
  fields: t => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    ingredients: t.relation('ingredients'),
    methods: t.relation('methods'),
  }),
})

builder.prismaObject('Ingredient', {
  fields: t => ({
    id: t.exposeID('id'),
    recipeId: t.exposeID('recipeId'),
    name: t.exposeString('name'),
    quantity: t.exposeFloat('quantity'),
    unit: t.exposeString('unit'),
  }),
})

builder.prismaObject('Method', {
  fields: t => ({
    id: t.exposeID('id'),
    recipeId: t.exposeID('recipeId'),
    step: t.exposeString('step'),
    stepTime: t.exposeInt('stepTime'),
  }),
})

builder.queryFields(t => ({
  recipe: t.prismaField({
    type: 'Recipe',
    args: { id: t.arg.id({ required: true }) },
    nullable: true,
    resolve: async (query, _parent, args) => prisma.recipe.findUnique({ ...query, where: { id: args.id } }),
  }),
  recipes: t.prismaField({
    type: ['Recipe'],
    args: { searchString: t.arg.string({ required: false }) },
    resolve: async query => prisma.recipe.findMany({ ...query }),
  }),
  // ingredients: t.prismaField({
  //   type: ['Ingredient'],
  //   args: { recipeId: t.arg.id({ required: true }) },
  //   resolve: async (query, _parent, args) => prisma.ingredient.findMany({ ...query, where: { recipeId: args.recipeId } }),
  // }),
  // methods: t.prismaField({
  //   type: ['Method'],
  //   args: { recipeId: t.arg.id({ required: true }) },
  //   resolve: async (query, _parent, args) => prisma.method.findMany({ ...query, where: { recipeId: args.recipeId } }),
  // }),
}))

// builder.mutationFields(t => ({
//   createRecipe: t.prismaField({
//     type: 'Recipe',
//     args: {
//       name: t.arg.string({ required: true }),
//     },
//     resolve: async (_query, _parent, args) => createRecipe({ name: args.name }),
//   }),
// }))

export const schema = builder.toSchema()
