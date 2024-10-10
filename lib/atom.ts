import { atomWithStorage } from 'jotai/utils'

type CookTimer = {
  methodId: string
  stepNo: number
  endDate: Date
}

export const cookTimersAtom = atomWithStorage<CookTimer[]>('cook-timers', [])
