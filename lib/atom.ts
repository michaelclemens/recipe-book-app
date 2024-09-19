import { Ingredient, Method } from '@prisma/client'
import { atom } from 'jotai'

export const methodsAtom = atom<Method[]>([])

export const ingredientsAtom = atom<Ingredient[]>([])
