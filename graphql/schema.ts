import { z } from 'zod'
import { builder } from './builder'
import './schemas/ingredient'
import './schemas/method'
import './schemas/recipe'

export const sortOrderInput = builder.inputType('SortOrderInput', {
  validate: {
    schema: z.object({
      id: z.string(),
      order: z.number().positive().or(z.null()),
    }),
  },
  fields: t => ({
    id: t.id({ required: true }),
    order: t.int({ required: false }),
  }),
})

export const schema = builder.toSchema()
