import Link from 'next/link'
import RecipeList from '@/components/recipe/RecipeList'
import { Button } from '@/components/ui'

export default function Home({ searchParams }: { searchParams?: { query?: string; page?: string } }) {
  const query = searchParams?.query || ''
  const currentPage = Number(searchParams?.page) || 1
  return (
    <main className="mx-auto w-full max-w-[90rem]">
      <RecipeList query={query} currentPage={currentPage} />
      <Link href="/recipe/create">
        <Button className="text-slate-300" title="Create">
          Create New Recipe
        </Button>
      </Link>
    </main>
  )
}
