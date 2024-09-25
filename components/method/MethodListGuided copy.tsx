'use client'

import { Method } from '@prisma/client'
import { motion, MotionValue, useAnimation, useInView, useMotionValue, useScroll, useSpring, useTransform, Variants } from 'framer-motion'
import Link from 'next/link'
import { Dispatch, Ref, RefObject, SetStateAction, useEffect, useRef, useState } from 'react'
import { sortByOrder } from '@/util/sort'

const DRAG_BUFFER = 20

const SPRING_OPTIONS = {
  type: 'spring',
  mass: 3,
  stiffness: 400,
  damping: 50,
}

const item = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.5,
      type: 'tween',
      ease: 'easeIn',
    },
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.2,
      duration: 0.5,
      type: 'tween',
      ease: 'easeOut',
    },
  },
}

const Dots = ({ imgIndex, methods, setImgIndex }: { imgIndex: number; methods: Method[]; setImgIndex: Dispatch<SetStateAction<number>> }) => {
  return (
    <div className="mt-4 flex w-full items-end justify-center gap-2">
      {methods.map((_, idx) => {
        return (
          <button
            key={idx}
            onClick={() => setImgIndex(idx)}
            className={`h-3 w-3 rounded-full transition-colors ${idx === imgIndex ? 'bg-neutral-50' : 'bg-neutral-500'}`}
          />
        )
      })}
    </div>
  )
}

export default function MethodListGuided({
  recipeId,
  methods: initialMethods,
  currentStep,
}: {
  recipeId: string
  methods: Method[]
  currentStep: number
}) {
  const methods = initialMethods.sort(sortByOrder)
  const [imgIndex, setImgIndex] = useState(0)
  const dragX = useMotionValue(0)
  const ref = useRef()

  const onDragEnd = () => {
    const x = dragX.get()

    if (x <= -DRAG_BUFFER && imgIndex < methods.length - 1) {
      setImgIndex(pv => pv + 1)
    } else if (x >= DRAG_BUFFER && imgIndex > 0) {
      setImgIndex(pv => pv - 1)
    }
  }

  return (
    <div className="relative flex h-full flex-col">
      <div ref={ref} className="relative h-full overflow-y-auto overflow-x-hidden scrollbar scrollbar-track-transparent scrollbar-thumb-slate-800">
        <motion.div
          drag="x"
          dragConstraints={{
            left: 0,
            right: 0,
          }}
          style={{
            x: dragX,
          }}
          animate={{
            translateX: `-${imgIndex * 100}%`,
          }}
          transition={SPRING_OPTIONS}
          onDragEnd={onDragEnd}
          className="flex h-full cursor-grab snap-x gap-36 active:cursor-grabbing"
        >
          {methods.map((method, index) => {
            const step = index + 1
            return (
              <motion.li
                key={method.id}
                id={`step-${step}`}
                variants={item}
                initial="hidden"
                whileInView="visible"
                viewport={{ root: ref, amount: 0.3 }}
                className="h-full w-[95rem] shrink-0 snap-start list-decimal text-3xl leading-snug"
              >
                {method.step}
              </motion.li>
            )
          })}
        </motion.div>
      </div>
      <Dots methods={methods} imgIndex={imgIndex} setImgIndex={setImgIndex} />
    </div>
  )
}
