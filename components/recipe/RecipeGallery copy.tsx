'use client'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Recipe } from '@prisma/client'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { FaClone, FaCog, FaTimes, FaTrashAlt } from 'react-icons/fa'
import { GiHotMeal } from 'react-icons/gi'
import { IoEllipsisVertical } from 'react-icons/io5'
import { deleteRecipe } from '@/lib/client'
import { sortByDate } from '@/util/sort'
import Loader from '../ui/Loader'
import Pagination from '../ui/Pagination'

const fallbackImageSrc = 'https://loremflickr.com/580/256/food,meal,dish'

const buttonIcon: Variants = {
  hidden: { x: -10, opacity: 0, transition: { duration: 0.2, type: 'spring' } },
  visible: { x: 0, opacity: 1, transition: { delay: 0.2, duration: 0.3, type: 'spring' } },
}

function RecipeGalleryItem({ recipe, onSelect }: { recipe: Recipe; onSelect: (recipe: Recipe) => void }) {
  const { push } = useRouter()
  const [loading, setLoading] = useState(false)

  const onEdit = async (recipe: Recipe) => {
    setLoading(true)
    push(`/recipe/create/${recipe.id}`)
  }

  const onDelete = async (recipe: Recipe) => {
    setLoading(true)
    await deleteRecipe(recipe)
    setLoading(false)
  }

  return (
    <motion.li layoutId={recipe.id} className="group relative flex h-64 flex-grow rounded-md shadow-sm md:h-56">
      <div className="relative z-10 flex flex-grow flex-col items-center">
        <Menu>
          <div className="flex w-full items-center gap-2 rounded-t-lg bg-black/70 px-2 pb-3 pt-2">
            <h3 className="w-full text-left text-xl font-bold leading-6 text-slate-200">{recipe.name}</h3>
            <div className="relative inline-block">
              <MenuButton
                title="Options menu"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-200 opacity-60 outline outline-1 outline-slate-400/40 transition-opacity duration-300 hover:opacity-100"
              >
                <IoEllipsisVertical size="1.25rem" />
              </MenuButton>
              <MenuItems
                transition
                className="w-26 absolute -right-2 z-20 mt-1 origin-top-right rounded-md shadow-2xl ring-1 ring-slate-400/20 transition data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in focus:outline-none"
              >
                <div className="divide-y divide-slate-400/20 text-base text-slate-200">
                  <MenuItem
                    as="button"
                    className="flex w-full items-center rounded-t-md bg-black/80 px-4 pb-2 pt-3 transition-opacity duration-300 hover:bg-black/90"
                    title="Edit recipe"
                    onClick={() => onEdit(recipe)}
                  >
                    <FaCog size="1rem" className="mr-3" />
                    <span>Edit</span>
                  </MenuItem>
                  <MenuItem
                    as="button"
                    className="flex w-full items-center bg-black/80 px-4 pb-3 pt-2 transition-opacity duration-300 hover:bg-black/90"
                    title="Clone recipe"
                  >
                    <FaClone size="1rem" className="mr-3" />
                    <span>Clone</span>
                  </MenuItem>
                  <MenuItem
                    as="button"
                    className="flex w-full items-center rounded-b-md bg-black/80 px-4 pb-3 pt-2 text-red-700 transition-opacity duration-300 hover:bg-black/90"
                    title="Delete recipe"
                    onClick={() => onDelete(recipe)}
                  >
                    <FaTrashAlt size="1rem" className="mr-3" />
                    <span>Delete</span>
                  </MenuItem>
                </div>
              </MenuItems>
            </div>
          </div>
        </Menu>

        <div className="flex w-full flex-grow cursor-pointer items-end" title="Let's start cooking!" onClick={() => onSelect(recipe)}>
          <motion.button
            initial="hidden"
            animate="hidden"
            whileHover="visible"
            className="flex w-full justify-center rounded-b-lg bg-black/90 px-2 pb-2 pt-3 text-xl font-bold text-slate-200 opacity-0 transition-opacity duration-300 group-hover:opacity-90"
          >
            <span>Let&lsquo;s Cook</span>
            <motion.span variants={buttonIcon} className="ml-2">
              <GiHotMeal />
            </motion.span>
          </motion.button>
        </div>
      </div>
      <Image
        className="z-0 h-full w-full rounded-lg object-cover object-center brightness-90 transition-all duration-300 group-hover:brightness-110"
        src={recipe.imageSrc ? recipe.imageSrc : fallbackImageSrc}
        alt="Recipe image"
        quality={60}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
      />
      {loading && <Loader />}
    </motion.li>
  )
}

function SingleRecipe({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  const { push } = useRouter()
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 z-40 mx-auto flex h-1/3 w-screen max-w-7xl items-start justify-start p-2 sm:h-5/6 sm:p-5 lg:-mt-10 lg:h-[90%] lg:p-10">
      <motion.div layoutId={recipe.id} className="relative h-full w-full rounded-md bg-slate-900">
        <div className="relative z-10 flex h-full flex-grow flex-col text-xl md:text-5xl">
          <div className="flex w-full items-center justify-center gap-2 rounded-t-lg bg-black/70 px-3 pb-5 pt-4 md:px-5 md:pb-8 md:pt-7">
            <h1 className="w-full text-center font-bold text-slate-200">{recipe.name}</h1>
            <div className="inline-flex justify-end">
              <button title="Close" onClick={onClose} className="opacity-50 transition-opacity duration-300 hover:opacity-90">
                <FaTimes />
              </button>
            </div>
          </div>
          <div className="flex w-full flex-grow items-end">
            <motion.button
              onClick={() => push(`/recipe/cook/${recipe.id}`, { scroll: false })}
              title="Let's start cooking!"
              className="flex w-full justify-center rounded-b-lg bg-black/70 px-3 pb-5 pt-4 font-bold text-slate-200 transition-all duration-300 group-hover:opacity-90 hover:bg-black/90 hover:opacity-100 md:px-5 md:pb-8 md:pt-7"
            >
              <span>Start Cooking!</span>
              <span className="ml-4 animate-[bounce_2s_linear_infinite]">
                <GiHotMeal />
              </span>
            </motion.button>
          </div>
        </div>
        <Image
          className="z-0 h-full w-full rounded-lg object-cover object-center"
          src={recipe.imageSrc ? recipe.imageSrc : fallbackImageSrc}
          alt={`Recipe ${recipe.name} image`}
          quality={80}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </motion.div>
    </div>
  )
}

export default function RecipeGallery({ recipes, totalPages }: { recipes: Recipe[]; totalPages: number }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  const onDeselect = () => {
    setSelectedRecipe(null)
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="relative mb-5 p-2">
      <ul
        role="list"
        className="relative grid max-h-[47rem] grid-cols-1 items-stretch justify-between gap-5 overflow-y-auto rounded-lg pb-5 pr-2 scrollbar scrollbar-track-transparent scrollbar-thumb-slate-800 sm:grid-cols-2 lg:grid-cols-4 lg:bg-slate-900 lg:p-5"
      >
        {recipes.sort(sortByDate).map(recipe => (
          <RecipeGalleryItem key={recipe.id} recipe={recipe} onSelect={(recipe: Recipe) => setSelectedRecipe(recipe)} />
        ))}
      </ul>

      <AnimatePresence>
        {selectedRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="overlay"
            className="fixed left-0 top-0 z-30 h-screen w-screen cursor-pointer bg-black/70"
            onClick={onDeselect}
          />
        )}

        {selectedRecipe && <SingleRecipe key="image" recipe={selectedRecipe} onClose={onDeselect} />}
      </AnimatePresence>
      <div className="sticky bottom-0 left-0 flex w-full items-center justify-center py-5">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  )
}
