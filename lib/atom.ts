import { Ingredient, Method } from '@prisma/client'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

type CookTimer = {
  methodId: string
  stepNo: number
  endDate: Date
}

export const methodsAtom = atom<Method[]>([])
export const ingredientsAtom = atom<Ingredient[]>([])
export const cookTimersAtom = atomWithStorage<CookTimer[]>('cook-timers', [])
