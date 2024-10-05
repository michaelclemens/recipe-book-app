'use client'

import { intervalToDuration } from 'date-fns'
import { useAtom } from 'jotai'
import { Orbitron, Permanent_Marker } from 'next/font/google'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FaBell } from 'react-icons/fa'
import { cookTimersAtom } from '@/lib/atom'
import PostIt from '../ui/PostIt'

const orbitron = Orbitron({ weight: '600', subsets: ['latin'] })

const Timer = ({ endDate }: { endDate: Date }) => {
  const [hours, setHours] = useState(0)
  const [mins, setMinutes] = useState(0)

  const getTimeLeft = useCallback(() => {
    const timeLeft = intervalToDuration({ start: new Date(), end: endDate })
    setHours(timeLeft.hours ?? 0)
    setMinutes(timeLeft.minutes ?? 0)
  }, [endDate])

  useEffect(() => {
    getTimeLeft()
    const interval = setInterval(() => getTimeLeft(), 60 * 1000)
    return () => clearInterval(interval)
  }, [getTimeLeft])

  const padNum = (number: number) => number.toString().padStart(2, '0')

  return (
    <div className={`${orbitron.className} m-1 flex w-full items-center rounded-lg border-2 border-double border-red-700 p-2 text-4xl text-red-700`}>
      <div className="flex w-full justify-center">
        {padNum(hours)}
        <div className="animate-pulse">:</div>
        {padNum(mins)}
      </div>
      <FaBell className="ml-1 inline-flex justify-end text-2xl" />
    </div>
  )
}

const marker = Permanent_Marker({ weight: '400', subsets: ['latin'], preload: true })

export default function CookTimers() {
  const ref = useRef(null)
  const [cookTimers] = useAtom(cookTimersAtom)
  return (
    <div className="flex h-full w-full flex-row overflow-hidden p-5">
      <div
        ref={ref}
        className="flex w-full flex-wrap gap-5 overflow-y-auto overflow-x-hidden scrollbar scrollbar-track-transparent scrollbar-thumb-neutral-500/50"
      >
        {cookTimers.sort().map(cookTimer => (
          <PostIt key={cookTimer.methodId}>
            <div className={`${marker.className} -mt-12 text-center text-3xl text-red-700`}>Step {cookTimer.stepNo}</div>
            <div className="flex h-full items-center justify-center">
              <Timer endDate={cookTimer.endDate} />
            </div>
          </PostIt>
        ))}
      </div>
    </div>
  )
}
