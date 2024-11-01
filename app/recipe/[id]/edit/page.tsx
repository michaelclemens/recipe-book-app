'use client'

import Image from 'next/image'
import { use } from 'react'
import useRecipe from '@/hooks/recipe/useRecipe'
import { PaperInput } from '@/components/ui/Paper'
import Polariod from '@/components/ui/Polariod'

export default function RecipePage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params)
  const { id } = params
  const recipe = useRecipe(id)

  if (!recipe) return

  return (
    <div className="flex items-center px-10">
      <Polariod className="max-w-96 -rotate-6" pinned>
        <div className="relative h-full min-h-60 w-full min-w-80 flex-grow">
          {recipe.imageSrc && (
            <Image
              className="object-cover object-center"
              src={recipe.imageSrc ?? ''}
              alt={`Recipe ${recipe.name} image`}
              quality={60}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          )}
        </div>
        <div className="flex min-h-20 items-center justify-center text-center text-2xl text-neutral-950">
          <PaperInput defaultValue={recipe.name} />
        </div>
      </Polariod>
    </div>
  )
}
