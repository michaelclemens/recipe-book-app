import { z } from 'zod'
import { unitLabelMap } from '../util/unit'

export const RecipeSchema = z.object({
  name: z.string().min(1, { message: 'Recipe name is required' }),
})
export type RecipeFormFields = z.infer<typeof RecipeSchema>

export const IngredientSchema = z.object({
  name: z.string().min(1, { message: 'Ingredient name is required' }),
  quantity: z
    .number()
    .multipleOf(0.1)
    .positive()
    .optional()
    .transform(value => value ?? undefined)
    .or(z.coerce.number())
    .nullish(),
  unit: z
    .nativeEnum(unitLabelMap, { message: 'Invalid unit' })
    .optional()
    .transform(value => value ?? undefined)
    .or(z.coerce.string())
    .nullish(),
  optional: z.boolean().optional().nullish(),
})
export type IngredientFormFields = z.infer<typeof IngredientSchema>

export const MethodSchema = z.object({
  step: z.string().min(1, { message: 'Method step is required' }),
  stepTime: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .transform(value => value ?? undefined)
    .or(z.coerce.number())
    .nullish(),
})
export type MethodFormFields = z.infer<typeof MethodSchema>

export const ItemSchema = z.object({
  name: z.string().min(1, { message: 'Item name is required' }),
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
export type ItemFormFields = z.infer<typeof ItemSchema>
