'use client'

import { motion, Variants } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FaBook, FaList, FaShoppingCart } from 'react-icons/fa'
import { GiCook } from 'react-icons/gi'
import recipeBG from '../public/backgrounds/recipe.jpg'
import shoppingBG from '../public/backgrounds/shopping.jpg'

const parentVariants = {
  hidden: { transition: { staggerChildren: 0.2 } },
  visible: { transition: { delayChildren: 0.2, staggerChildren: 0.2 } },
}
const iconVariants: Variants = {
  hidden: { x: 500, opacity: 0, transition: { type: 'spring', damping: 20, duration: 0.2 } },
  visible: { x: 0, opacity: 100, transition: { type: 'spring', damping: 20, duration: 0.5 } },
}

const parentLeftVariants: Variants = {
  ...parentVariants,
  visible: { ...parentVariants.visible, transition: { ...parentVariants.visible.transition, staggerDirection: -1 } },
}
const iconLeftVariants: Variants = { ...iconVariants, hidden: { ...iconVariants.hidden, x: -500 } }

export default function Home() {
  return (
    <main className="fixed flex h-full w-full text-6xl font-semibold">
      <Link href="/recipe" className="group" title="Go to recipe book">
        <motion.div
          initial="hidden"
          whileHover="visible"
          variants={parentVariants}
          className="fixed -ml-1 h-full w-full"
          style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
        >
          <div className="absolute top-0 left-0 z-10 flex h-2/3 w-full items-center justify-center">
            <div className="flex h-28 w-full items-center bg-black/50 pl-5">
              <div className="flex w-1/2 justify-center gap-5 text-white/50 transition-colors delay-150 duration-500 group-hover:text-white">
                <span>Recipe Book</span>
                <div className="flex items-center gap-5 text-4xl">
                  <motion.span variants={iconVariants}>
                    <GiCook />
                  </motion.span>
                  <motion.span variants={iconVariants}>
                    <FaBook />
                  </motion.span>
                </div>
              </div>
            </div>
          </div>
          <Image
            src={recipeBG}
            placeholder="blur"
            fill
            quality={80}
            alt="Recipe Image"
            className="z-0 object-cover object-bottom brightness-50 transition-all delay-150 duration-500 group-hover:brightness-100"
          />
        </motion.div>
      </Link>
      <Link href="/shopping" className="group" title="Go to shopping lists">
        <motion.div
          initial="hidden"
          whileHover="visible"
          variants={parentLeftVariants}
          className="fixed ml-1 h-full w-full"
          style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}
        >
          <div className="absolute right-0 bottom-0 z-10 flex h-2/3 w-full items-center justify-center">
            <div className="flex h-28 w-full items-center bg-black/50 pr-5">
              <div className="flex w-1/2 translate-x-full justify-center gap-5 text-white/50 transition-colors delay-150 duration-500 group-hover:text-white">
                <div className="flex items-center gap-5 text-4xl">
                  <motion.span variants={iconLeftVariants}>
                    <FaShoppingCart />
                  </motion.span>
                  <motion.span variants={iconLeftVariants}>
                    <FaList />
                  </motion.span>
                </div>
                <span>Shopping Lists</span>
              </div>
            </div>
          </div>
          <Image
            src={shoppingBG}
            placeholder="blur"
            fill
            quality={80}
            alt="Shopping Image"
            className="z-0 object-cover object-top brightness-50 transition-all delay-150 duration-500 group-hover:brightness-100"
          />
        </motion.div>
      </Link>
    </main>
  )
}
