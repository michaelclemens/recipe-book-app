// import Link from 'next/link'
import { HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import { prefetchRecipes } from '@/hooks/recipe/useRecipes'
import RecipeGallery from '@/components/recipe/RecipeGallery'

// import { Button } from '@/components/ui'

export default async function RecipeHome(props: { searchParams?: Promise<{ search?: string; page?: string }> }) {
  const searchParams = await props.searchParams
  const search = searchParams?.search || undefined
  const page = Number(searchParams?.page) || undefined

  const recipes = await prefetchRecipes({ search, page })
  return (
    <main className="h-full w-full xl:px-10">
      {/* <Link href="/recipe/create" className="ml-2">
        <Button className="text-slate-300" title="Create New Recipe">
          Create New Recipe
        </Button>
      </Link> */}
      <div className="flex h-full flex-col">
        <HydrationBoundary state={recipes}>
          <Suspense fallback="Loading...">
            <RecipeGallery />
          </Suspense>
        </HydrationBoundary>
      </div>
    </main>
  )
}
