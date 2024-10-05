// import Link from 'next/link'
import { getRecipes } from '@/lib/client'
import RecipeGallery from '@/components/recipe/RecipeGallery'

// import { Button } from '@/components/ui'

const recipeCount = 10

export default async function Home({ searchParams }: { searchParams?: { query?: string; page?: string } }) {
  const query = searchParams?.query || ''
  const currentPage = Number(searchParams?.page) || 1
  const [totalCount, recipes] = await getRecipes(query, currentPage, recipeCount)
  const totalPages = Math.ceil(totalCount / recipeCount)
  return (
    <main className="mx-auto h-full w-full max-w-[90rem]">
      {/* <Link href="/recipe/create" className="ml-2">
        <Button className="text-slate-300" title="Create New Recipe">
          Create New Recipe
        </Button>
      </Link> */}
      <div className="flex h-full flex-col">
        <RecipeGallery recipes={recipes} totalPages={totalPages} />
      </div>
    </main>
  )
}
