import Image from 'next/image'
import { getRecipe } from '@/lib/client'
import Polariod from '@/components/ui/Polariod'

export default async function RecipePage({ params: { id } }: { params: { id: string } }) {
  const recipe = await getRecipe(id)
  return (
    <div className="flex items-center px-10">
      <Polariod className="max-w-96 -rotate-6" pinned>
        <div className="relative h-full min-h-60 w-full min-w-80 flex-grow">
          <Image
            className="object-cover object-center"
            src={recipe.imageSrc ?? ''}
            alt={`Recipe ${recipe.name} image`}
            quality={60}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
        <div className="flex min-h-20 items-center justify-center text-center text-2xl text-neutral-950">{recipe.name}</div>
      </Polariod>
    </div>
  )
}
