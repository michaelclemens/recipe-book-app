'use client'

import { Method } from '@prisma/client'
import { addMinutes, roundToNearestMinutes } from 'date-fns'
import { motion, useMotionValue } from 'framer-motion'
import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { useEffect, useState } from 'react'
import { cookTimersAtom } from '@/lib/atom'
import useMethods from '@/hooks/recipe/useMethods'
import Paper from '../ui/Paper'

const dragBuffer = 150

export default function MethodListGuided({ recipeId }: { recipeId: string }) {
  const methods = useMethods(recipeId)
  const [current, setCurrent] = useState(methods[0])
  const [completed, setCompleted] = useState<string[]>([])
  const dragX = useMotionValue(0)
  const currentIndex = methods.indexOf(current)
  const [cookTimers, setCookTimers] = useAtom(cookTimersAtom)
  const resetCookTimers = useResetAtom(cookTimersAtom)

  useEffect(() => {
    return () => resetCookTimers()
  }, [resetCookTimers])

  const isCurrent = (method: Method) => current.id === method.id
  const isCompleted = (method: Method) => completed.includes(method.id)
  const getStepNo = (index: number) => index + 1
  const hasTimer = (method: Method) => (cookTimers.find(timer => timer.methodId === method.id) ? true : false)

  const getMinuteString = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours > 0 ? `${hours}hrs ` : ''}${mins}mins`
  }

  const onDragEnd = () => {
    const x = dragX.get()
    if (x <= -dragBuffer && currentIndex < methods.length - 1) {
      setCurrent(methods[currentIndex + 1])
    } else if (x >= dragBuffer && currentIndex > 0) {
      setCurrent(methods[currentIndex - 1])
    }
  }

  const onDone = () => {
    setCompleted([...completed, current.id])
    const next = methods[currentIndex + 1]
    if (!next) return
    setCurrent(next)
  }

  const addTimer = (stepNo: number, method: Method) => {
    if (hasTimer(method)) return
    setCookTimers([
      ...cookTimers,
      { methodId: method.id, stepNo, endDate: roundToNearestMinutes(addMinutes(new Date(), method.stepTime as number), { roundingMethod: 'ceil' }) },
    ])
  }

  return (
    <>
      <Paper lined={false}>
        <div className="flex h-full w-full items-center pt-5">
          {methods.map(method => {
            const isCur = isCurrent(method)
            const isComp = isCompleted(method)
            return (
              <div key={method.id} className="group relative w-full last-of-type:mr-5 last-of-type:w-8">
                <div className="absolute inset-0 flex items-center group-last-of-type:hidden">
                  <div className={`h-0.5 w-full ${isComp ? 'bg-green-500' : 'bg-neutral-300'}`} />
                </div>
                <div
                  onClick={() => !isCur && setCurrent(method)}
                  className={`group relative flex h-8 w-8 ${isCur ? '' : 'cursor-pointer'} items-center justify-center rounded-full ${isComp ? 'bg-green-400 ring-green-500' : 'bg-[#eaebe1] ring-neutral-400'} ring-2`}
                >
                  {!isComp && (
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${isCur ? 'opacity-100' : 'opacity-0'} bg-neutral-300 transition-opacity duration-300 group-hover:opacity-100`}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Paper>

      <div className="flex h-full w-full flex-row overflow-hidden">
        {methods.map((method, index) => (
          <Paper
            key={method.id}
            lined={false}
            motionProps={{
              drag: 'x',
              style: { x: dragX },
              dragConstraints: { left: 0, right: 0 },
              animate: {
                translateX: `-${currentIndex * 100}%`,
              },
              onDragEnd,
            }}
            className="h-full w-full flex-shrink-0 cursor-grab active:cursor-grabbing"
          >
            <div className="my-10 flex h-full flex-col justify-start overflow-y-auto py-1 text-4xl md:justify-center">
              <motion.div initial={{ opacity: 0.2 }} whileInView={{ opacity: 1 }} viewport={{ amount: 'all' }}>
                {getStepNo(index)}. {method.step}
              </motion.div>
            </div>
            <div className="flex w-full flex-row items-center text-5xl">
              {method.stepTime && (
                <button
                  onClick={() => addTimer(getStepNo(index), method)}
                  disabled={hasTimer(method)}
                  className="flex w-full flex-col justify-start text-3xl disabled:opacity-50 md:text-4xl"
                >
                  <span>Start timer</span>
                  <span>({getMinuteString(method.stepTime)})</span>
                </button>
              )}
              <button onClick={onDone} title="Next step" className="flex w-full justify-end">
                Done
              </button>
            </div>
          </Paper>
        ))}
      </div>
    </>
  )
}
