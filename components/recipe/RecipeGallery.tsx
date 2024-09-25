'use client'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Recipe } from '@prisma/client'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { FaClone, FaCog, FaTrashAlt } from 'react-icons/fa'
import { GiHotMeal } from 'react-icons/gi'
import { IoEllipsisVertical } from 'react-icons/io5'
import { deleteRecipe } from '@/lib/client'
import { sortByDate } from '@/util/sort'
import Loader from '../ui/Loader'
import Pagination from '../ui/Pagination'

const fallbackImageSrc = 'https://loremflickr.com/580/256/food,meal,dish'

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
    <motion.li className="group/item relative flex h-64 flex-grow rounded-md shadow-sm md:h-60" key={recipe.id} layoutId={recipe.id}>
      <div className="relative z-10 flex flex-grow flex-col items-center">
        <Menu>
          <div className="flex w-full gap-2 rounded-t-lg bg-black/70 px-2 pb-3 pt-2">
            <h3 className="w-full text-left text-xl font-bold leading-6 text-slate-200">{recipe.name}</h3>
            <div className="relative inline-block">
              <MenuButton
                as="button"
                title="Options menu"
                className="h-5 w-5 pt-1 text-slate-200 opacity-60 transition-opacity duration-300 hover:opacity-100"
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
        <div className="flex w-full flex-grow items-end">
          <button
            onClick={() => onSelect(recipe)}
            title="Let's start cooking!"
            className="flex w-full justify-center rounded-b-lg bg-black/70 px-2 pb-2 pt-3 text-xl font-bold text-slate-200 opacity-0 transition-all duration-300 group-hover/item:opacity-90 hover:bg-black/90 hover:opacity-100"
          >
            <span>Let&lsquo;s Cook</span>
            <GiHotMeal className="ml-2" size="1.25rem" />
          </button>
        </div>
      </div>
      <Image
        className="z-0 h-full w-full rounded-lg object-cover object-center brightness-90 transition-all duration-300 group-hover/item:brightness-110"
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

function SingleRecipe({ recipe }: { recipe: Recipe }) {
  const { push } = useRouter()
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 z-30 mx-auto flex h-[35rem] w-screen items-start justify-start px-5 md:h-[50rem] lg:h-[40rem] xl:my-auto xl:w-[80rem] xl:items-center xl:justify-start xl:p-0">
      <motion.div layoutId={recipe.id} className="relative h-full w-full rounded-md bg-slate-900">
        <div className="relative z-40 flex h-full flex-grow flex-col">
          <div className="flex w-full items-center justify-center gap-2 rounded-t-lg bg-black/70 px-5 pb-8 pt-7">
            <h1 className="text-center text-5xl font-bold text-slate-200">{recipe.name}</h1>
          </div>
          <div className="flex w-full flex-grow items-end">
            <button
              onClick={() => push(`/recipe/cook/${recipe.id}`, { scroll: false })}
              title="Let's start cooking!"
              className="flex w-full justify-center rounded-b-lg bg-black/70 px-5 pb-7 pt-8 text-5xl font-bold text-slate-200 transition-all duration-300 group-hover/item:opacity-90 hover:bg-black/90 hover:opacity-100"
            >
              <span>Start Cooking!</span>
              <GiHotMeal className="ml-4" size="2.75rem" />
            </button>
          </div>
        </div>
        <Image
          className="z-30 h-full w-full rounded-lg object-cover object-center"
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
    <>
      <ul
        role="list"
        className="relative grid max-h-screen grid-cols-1 items-stretch justify-between gap-5 overflow-y-auto rounded-lg pr-2 scrollbar scrollbar-track-transparent scrollbar-thumb-slate-800 sm:grid-cols-2 lg:grid-cols-4 lg:bg-slate-900 lg:p-5"
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
            className="fixed bottom-0 left-0 right-0 top-0 z-10 h-screen w-screen cursor-pointer bg-black/70"
            onClick={onDeselect}
          />
        )}

        {selectedRecipe && <SingleRecipe key="image" recipe={selectedRecipe} />}
      </AnimatePresence>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  )
}
