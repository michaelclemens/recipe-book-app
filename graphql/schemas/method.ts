import { addMethod, deleteMethod, updateMethod, updateMethodOrder } from '../../lib/client/recipe'
import { MethodSchema } from '../../lib/formSchema'
import { builder } from '../builder'
import { sortOrderInput } from '../schema'

builder.prismaObject('Method', {
  fields: t => ({
    id: t.exposeID('id'),
    recipeId: t.exposeID('recipeId'),
    step: t.exposeString('step'),
    stepTime: t.exposeInt('stepTime', { nullable: true }),
    order: t.exposeInt('order', { nullable: true }),
  }),
})

const methodInput = builder.inputType('MethodInput', {
  validate: { schema: MethodSchema },
  fields: t => ({
    step: t.string({ required: true }),
    stepTime: t.int({ required: false }),
  }),
})

builder.mutationFields(t => ({
  addMethod: t.prismaField({
    type: 'Method',
    args: { recipeId: t.arg.id({ required: true }), input: t.arg({ type: methodInput, required: true }) },
    resolve: async (_, __, { recipeId, input }) => addMethod({ recipeId, data: { ...input } }),
  }),
  updateMethod: t.prismaField({
    type: 'Method',
    args: { id: t.arg.id({ required: true }), input: t.arg({ type: methodInput, required: true }) },
    resolve: async (_, __, { id, input }) => updateMethod({ id, data: { ...input } }),
  }),
  deleteMethod: t.prismaField({
    type: 'Method',
    nullable: true,
    args: { id: t.arg.id({ required: true }) },
    resolve: async (_, __, { id }) => deleteMethod(id),
  }),
  sortMethods: t.prismaField({
    type: ['Method'],
    args: { input: t.arg({ type: [sortOrderInput], required: true }) },
    resolve: async (_, __, { input }) => updateMethodOrder(input),
  }),
}))
