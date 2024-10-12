// import Link from 'next/link'
import { HydrationBoundary } from '@tanstack/react-query'
import { prefetchRecipes } from '@/hooks/recipe/useRecipes'
import RecipeGallery from '@/components/recipe/RecipeGallery'

// import { Button } from '@/components/ui'

export default async function RecipeHome({ searchParams }: { searchParams?: { query?: string; page?: string } }) {
  const query = searchParams?.query || undefined
  const page = Number(searchParams?.page) || undefined

  const recipes = await prefetchRecipes({ query, page })
  return (
    <main className="h-full w-full xl:px-10">
      {/* <Link href="/recipe/create" className="ml-2">
        <Button className="text-slate-300" title="Create New Recipe">
          Create New Recipe
        </Button>
      </Link> */}
      <div className="flex h-full flex-col">
        <HydrationBoundary state={recipes}>
          <RecipeGallery />
        </HydrationBoundary>
      </div>
    </main>
  )
}
