import { z } from 'zod'
import { unitLabelMap } from '@/util/unit'

export const RecipeSchema = z.object({
  name: z.string().min(1, { message: 'Recipe name is required' }),
})
export type RecipeFormFields = z.infer<typeof RecipeSchema>

export const IngredientSchema = z.object({
  name: z.string().min(1, { message: 'Ingredient name is required' }),
  optional: z.boolean().optional(),
  quantity: z.coerce
    .number()
    .multipleOf(0.1)
    .positive()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  unit: z
    .nativeEnum(unitLabelMap, { message: 'Invalid unit' })
    .optional()
    .or(z.literal('').transform(() => undefined)),
})
export type IngredientFormFields = z.infer<typeof IngredientSchema>

export const MethodSchema = z.object({
  step: z.string().min(1, { message: 'Method step is required' }),
  stepTime: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .or(z.literal('').transform(() => undefined)),
})
export type MethodFormFields = z.infer<typeof MethodSchema>
