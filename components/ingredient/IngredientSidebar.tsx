'use client'

import { Ingredient } from '@prisma/client'
import { motion } from 'framer-motion'
import { unitLabelMap } from '@/util/unit'

const list = {
  visible: {
    width: 'auto',
    transition: {
      type: 'tween',
      ease: 'easeIn',
      duration: 0.4,
      when: 'beforeChildren',
      staggerChildren: 0.05,
    },
  },
  hidden: {
    width: 'auto',
    transition: {
      type: 'tween',
      ease: 'easeOut',
      duration: 0.2,
      when: 'afterChildren',
      staggerChildren: 0.02,
    },
  },
}

const item = {
  visible: { opacity: 1, x: 0, width: 'auto', height: 'auto', transition: { type: 'tween', ease: 'easeIn', duration: 0.4 } },
  hidden: { opacity: 0, x: -10, width: 0, height: 0, transition: { type: 'tween', ease: 'easeOut', duration: 0.2 } },
}

export default function IngredientSidebar({ ingredients }: { ingredients: Ingredient[] }) {
  return (
    <motion.aside
      initial="hidden"
      whileHover="visible"
      variants={list}
      className={`sticky left-0 top-0 flex min-h-full flex-shrink-0 overflow-y-auto bg-slate-900 px-6 py-4 text-slate-200 scrollbar scrollbar-track-transparent scrollbar-thumb-slate-800`}
    >
      <ul className="space-y-4 pt-5">
        {ingredients.map(ingredient => (
          <li key={ingredient.id} className="mr-3 flex last-of-type:pb-5">
            <motion.div variants={item} className={`mr-3 flex flex-shrink-0 space-x-2 overflow-hidden`}>
              {ingredient.quantity && <span>{ingredient.quantity} qty</span>}
              {ingredient.unitValue && (
                <span>
                  {ingredient.unitValue} {ingredient.unit && unitLabelMap[ingredient.unit]}
                </span>
              )}
            </motion.div>

            <div className="flex flex-shrink-0 capitalize">{ingredient.name}</div>
          </li>
        ))}
      </ul>
    </motion.aside>
  )
}
