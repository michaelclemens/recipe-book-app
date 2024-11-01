import { addIngredient, deleteIngredient, updateIngredient, updateIngredientOrder } from '../../lib/client/recipe'
import { IngredientSchema } from '../../lib/formSchema'
import { builder } from '../builder'
import { sortOrderInput } from '../schema'

builder.prismaObject('Ingredient', {
  fields: t => ({
    id: t.exposeID('id'),
    recipeId: t.exposeID('recipeId'),
    name: t.exposeString('name'),
    quantity: t.exposeFloat('quantity', { nullable: true }),
    unit: t.exposeString('unit', { nullable: true }),
    optional: t.exposeBoolean('optional', { nullable: true }),
    order: t.exposeInt('order', { nullable: true }),
  }),
})

const ingredientInput = builder.inputType('IngredientInput', {
  validate: { schema: IngredientSchema },
  fields: t => ({
    name: t.string({ required: true }),
    quantity: t.float({ required: false }),
    unit: t.string({ required: false }),
    optional: t.boolean({ required: false }),
  }),
})

builder.mutationFields(t => ({
  addIngredient: t.prismaField({
    type: 'Ingredient',
    args: { recipeId: t.arg.id({ required: true }), input: t.arg({ type: ingredientInput, required: true }) },
    resolve: async (_, __, { recipeId, input }) => addIngredient({ recipeId, data: { ...input } }),
  }),
  updateIngredient: t.prismaField({
    type: 'Ingredient',
    args: { id: t.arg.id({ required: true }), input: t.arg({ type: ingredientInput, required: true }) },
    resolve: async (_, __, { id, input }) => updateIngredient({ id, data: { ...input } }),
  }),
  deleteIngredient: t.prismaField({
    type: 'Ingredient',
    nullable: true,
    args: { id: t.arg.id({ required: true }) },
    resolve: async (_, __, { id }) => deleteIngredient(id),
  }),
  sortIngredients: t.prismaField({
    type: ['Ingredient'],
    args: { input: t.arg({ type: [sortOrderInput], required: true }) },
    resolve: async (_, __, { input }) => updateIngredientOrder(input),
  }),
}))
