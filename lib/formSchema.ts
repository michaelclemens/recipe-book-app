import { Unit } from '@prisma/client'
import { z } from 'zod'

export const RecipeSchema = z.object({
  name: z.string().min(1, { message: 'Recipe name is required' }),
})
export type RecipeFormFields = z.infer<typeof RecipeSchema>

export const IngredientSchema = z.object({
  name: z.string().min(1, { message: 'Ingredient name is required' }),
  quantity: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  unitValue: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  unit: z
    .nativeEnum(Unit, { message: 'Invalid unit' })
    .optional()
    .or(z.literal('').transform(() => undefined)),
})
export type IngredientFormFields = z.infer<typeof IngredientSchema>

export const MethodSchema = z.object({
  step: z.string().min(1, { message: 'Method step is required' }),
  hour: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  minute: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .or(z.literal('').transform(() => undefined)),
})
export type MethodFormFields = z.infer<typeof MethodSchema>
