'use client'

import { Method } from '@prisma/client'
import { motion, useMotionValue, Variants } from 'framer-motion'
import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { sortByOrder } from '@/util/sort'

const DRAG_BUFFER = 20

const item: Variants = {
  hidden: {
    opacity: 0.2,
    transition: {
      duration: 0.2,
      type: 'tween',
      ease: 'easeOut',
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      type: 'tween',
      ease: 'easeIn',
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

export default function MethodListGuided({ methods: initialMethods }: { methods: Method[] }) {
  const methods = initialMethods.sort(sortByOrder)
  const [imgIndex, setImgIndex] = useState(0)
  const dragY = useMotionValue(0)
  const ref = useRef<HTMLDivElement | null>(null)

  const onDragEnd = () => {
    const y = dragY.get()

    if (y <= -DRAG_BUFFER && imgIndex < methods.length - 1) {
      setImgIndex(pv => pv + 1)
    } else if (y >= DRAG_BUFFER && imgIndex > 0) {
      setImgIndex(pv => pv - 1)
    }
  }

  return (
    <div className="relative flex h-full flex-col">
      <div ref={ref} className="relative h-full overflow-hidden">
        <motion.div
          drag="y"
          dragConstraints={{
            top: 0,
            bottom: 0,
          }}
          dragTransition={{
            power: 0,
            bounceDamping: 100,
            bounceStiffness: 1000,
          }}
          style={{
            y: dragY,
          }}
          animate={{
            translateY: `-${imgIndex * 100}%`,
          }}
          onDragEnd={onDragEnd}
          className="flex h-full cursor-grab flex-col active:cursor-grabbing"
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
                viewport={{ root: ref, amount: 0.7 }}
                className="h-full w-full shrink-0 snap-start list-decimal text-3xl leading-snug opacity-20"
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
