'use client'

import { AnimationSequence, motion, stagger, useAnimate, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion'
import { useState } from 'react'

export default function Home() {
  const x = useMotionValue(240)
  const rotateY = useTransform(x, [-400, 0], [-180, 0])
  const rotateX = useTransform(rotateY, [-50, 0], [0, 50])
  const lastPageYPos = useTransform(rotateY, [-20, 0], [0, 15])
  const pageFlipXPos = useTransform(rotateY, [-80, 0], [0, 6])
  const pageFlipYPos = useTransform(rotateY, [-20, 0], [0, 10])
  const pageFlipOpacity = useTransform(rotateY, [-180, -80], [1, 0])
  const pageXPos = useTransform(rotateY, [-180, 0], [-12, 0])
  const pageYPos = useTransform(rotateY, [-20, 0], [0, 15])
  const coverOpacity = useTransform(rotateY, [-85, 0], [0, 1])

  const containerW = useTransform(rotateY, [-150, 0], [500, 240])
  const width = useMotionTemplate`${containerW}px`
  const containerH = useTransform(rotateY, [-180, 0], [700, 384])
  const height = useMotionTemplate`${containerH}px`

  const spotlight = useTransform(rotateY, [-180, 0], [100, 40])
  const background = useMotionTemplate`radial-gradient(circle at 50% 50%,rgba(255, 255, 255, 0.2),transparent ${spotlight}%)`

  const [scope, animate] = useAnimate()
  const [opened, setOpened] = useState(false)
  const [animating, setAnimating] = useState(false)

  const toggle = async (open: boolean) => {
    const openSequence: AnimationSequence = [
      ['.book', { rotateY: -180 }, { ease: 'linear', duration: 0.3 }],
      ['.flip-page', { zIndex: 22 }],
      ['.flip-page', { rotateY: -180 }, { ease: 'linear', duration: 0.3, delay: stagger(0.1) }],
    ]
    const closeSequence: AnimationSequence = [
      ['.book', { rotateY: 0 }, { ease: 'linear', duration: 0.3 }],
      ['.flip-page', { zIndex: 18 }],
    ]

    await animate(open ? openSequence : closeSequence)
    x.set(open ? -400 : 0)
  }

  const onDragEnd = async () => {
    const rotateYVal = rotateY.get()
    let open: boolean | null = null
    if (!opened && rotateYVal <= -80) {
      open = true
    } else if (opened && rotateYVal >= -100) {
      open = false
    }

    if (open === null || animating) return
    setAnimating(true)
    await toggle(open)
    setOpened(open)
    setAnimating(false)
  }

  const onDrag = (event: DragEvent) => {
    if (animating) return
    const rect = scope.current?.getBoundingClientRect()
    if (!rect) return
    x.set(event.clientX - (opened ? rect.left : rect.right))
  }

  return (
    <motion.main className="relative mx-auto flex h-full w-full items-center justify-center bg-neutral-950" style={{ perspective: 1200 }}>
      <motion.div
        className="absolute h-full w-full"
        style={{ background, rotateX }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
        ref={scope}
        style={{ perspective: 1200, width, height }}
        className="book-wrapper relative"
      >
        <motion.div
          drag="x"
          dragConstraints={scope}
          dragElastic={{ left: 0, right: 0 }}
          dragMomentum={true}
          whileTap={{ cursor: 'grabbing' }}
          className="book absolute z-20 h-full w-full origin-left rounded-l-sm rounded-r-md bg-slate-800 shadow-xl shadow-black/30"
          onDrag={onDrag}
          onDragEnd={onDragEnd}
          style={{
            rotateY,
            rotateX,
            cursor: 'grab',
          }}
        >
          <motion.div className="flex h-full w-full items-center justify-center text-3xl" style={{ opacity: coverOpacity }}>
            Recipe Book
          </motion.div>
        </motion.div>

        {[1, 2, 3, 4].map(page => (
          <motion.div
            key={page}
            initial={{ zIndex: 18, opacity: 1 }}
            style={{
              rotateY: opened ? rotateY : 0,
              rotateX,
              x: pageFlipXPos,
              y: pageFlipYPos,
              scale: 0.95,
              opacity: opened ? pageFlipOpacity : 1,
            }}
            className={`flip-page absolute h-full w-full origin-left rounded-r-md border-r border-b border-slate-400/90 bg-neutral-300 shadow-lg`}
          />
        ))}

        <motion.div
          style={{ scale: 0.95, x: pageXPos, y: pageYPos, rotateX }}
          className="page absolute top-0 left-0 z-0 h-full w-full rounded-r-md border-r border-b border-slate-400/90 bg-neutral-300 shadow-lg"
        />
        <motion.div
          style={{ y: lastPageYPos, rotateX }}
          className="last-page absolute top-0 left-0 -z-20 h-full w-full rounded-l-sm rounded-r-md bg-slate-800 shadow-xl shadow-black/30"
        />
      </motion.div>
    </motion.main>
  )
}
