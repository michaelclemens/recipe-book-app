'use client'

import { Recipe } from '@prisma/client'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { FaClone, FaCog, FaTimes, FaTrashAlt } from 'react-icons/fa'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { GiHotMeal } from 'react-icons/gi'
import useRecipes, { useRecipeMutations } from '@/hooks/recipe/useRecipes'
import useFilterParams from '@/hooks/useFilterParams'
import Loader from '../ui/Loader'
import Pagination from '../ui/Pagination'
import Polariod from '../ui/Polariod'

const SelectedRecipe = ({
  recipe,
  onDeselect,
  onDelete,
}: {
  recipe: Recipe
  onDeselect: () => void
  onDelete: (recipe: Recipe) => Promise<void>
}) => {
  const { push } = useRouter()
  const [loading, setLoading] = useState(false)

  const onCook = async () => {
    setLoading(true)
    push(`/recipe/${recipe.id}/cook`, { scroll: false })
  }

  const onEdit = async () => {
    setLoading(true)
    push(`/recipe/${recipe.id}/edit`)
  }

  const handleDelete = async () => {
    setLoading(true)
    await onDelete(recipe)
    setLoading(false)
    onDeselect()
  }

  return (
    <AnimatePresence>
      <div className="absolute left-0 top-0 mx-auto flex h-full w-full items-start justify-center md:items-center">
        <Polariod className="relative z-20 mx-5 mt-5 h-1/2 w-full pt-0 text-3xl text-neutral-950 md:mt-0 md:h-5/6 xl:mx-0 xl:w-1/2">
          <div className="flex min-h-24 py-2">
            <div className="flex w-full items-center justify-center text-center md:text-5xl">{recipe.name}</div>
            <div className="inline-flex translate-x-2 items-start justify-end">
              <button title="Close" onClick={onDeselect} className="opacity-50 transition-opacity duration-300 hover:opacity-90 md:text-4xl">
                <FaTimes />
              </button>
            </div>
          </div>
          <div className="group relative w-full flex-grow">
            <button
              onClick={onCook}
              title="Start cooking recipe"
              className="absolute z-10 flex h-full w-full items-center justify-center text-4xl md:text-6xl"
            >
              <div className="w-full bg-white/50 py-5 opacity-0 transition-opacity delay-150 duration-300 group-hover:opacity-100">
                Let&lsquo;s cook!
                <GiHotMeal className="ml-2 inline" />
              </div>
            </button>

            <Image
              className="object-cover object-center"
              src={recipe.imageSrc ?? ''}
              alt={`Recipe ${recipe.name} image`}
              quality={80}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
          <div className="flex min-h-24 items-center justify-evenly text-2xl md:text-4xl">
            <button onClick={onEdit} title="Edit recipe" className="opacity-50 transition-opacity duration-300 hover:opacity-100">
              Edit <FaCog className="inline" />
            </button>
            <button title="Clone recipe" className="opacity-50 transition-opacity duration-300 hover:opacity-100">
              Clone <FaClone className="inline" />
            </button>
            <button onClick={handleDelete} title="Delete recipe" className="opacity-50 transition-opacity duration-300 hover:opacity-100">
              Delete <FaTrashAlt className="inline" />
            </button>
          </div>
          {loading && <Loader />}
        </Polariod>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        key="overlay"
        className="fixed left-0 top-0 z-10 h-screen w-screen cursor-pointer bg-black/70"
        onClick={onDeselect}
      />
    </AnimatePresence>
  )
}

export default function RecipeGallery() {
  const { recipes, totalPages } = useRecipes()
  const { deleteRecipe } = useRecipeMutations()
  const { query } = useFilterParams()

  const { push } = useRouter()
  const pathname = usePathname()
  const [recipe, setRecipe] = useState<Recipe | null>(null)

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const query = formData.get('query')?.toString() ?? undefined
    if (query) {
      const params = new URLSearchParams()
      params.set('query', query)
      push(`${pathname}?${params.toString()}`)
    } else {
      push(pathname)
    }
  }

  return (
    <>
      <form className="mb-10 flex w-full" onSubmit={onSearch}>
        <input name="query" className="w-full text-neutral-950" placeholder="Search..." defaultValue={query ?? ''} />
        <button type="submit" className="ml-5">
          <FaMagnifyingGlass />
        </button>
      </form>

      <div className="grid h-full grid-cols-1 gap-5 overflow-y-auto px-5 pb-px scrollbar scrollbar-track-transparent scrollbar-thumb-slate-800 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 xl:grid-rows-2 xl:px-0">
        {recipes.map(recipe => (
          <Polariod key={recipe.id} className="group relative cursor-pointer" onClick={() => setRecipe(recipe)}>
            <div className="relative w-full flex-grow">
              <Image
                className="object-cover object-center brightness-90 transition-all duration-300 group-hover:brightness-110"
                src={recipe.imageSrc ?? ''}
                alt={`Recipe ${recipe.name} image`}
                quality={60}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
            <div className="flex min-h-16 items-center justify-center text-center text-2xl text-neutral-950">{recipe.name}</div>
          </Polariod>
        ))}
        {recipe && <SelectedRecipe recipe={recipe} onDeselect={() => setRecipe(null)} onDelete={deleteRecipe} />}
      </div>
      <div className="sticky bottom-0 left-0 flex w-full items-center justify-center bg-neutral-950 py-10">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  )
}
