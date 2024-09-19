import Link from 'next/link'
import RecipeList from '@/components/recipe/RecipeList'
import { Button } from '@/components/ui'

export default function Home() {
  return (
    <main className="mx-auto flex w-1/3 flex-col items-center justify-center">
      <RecipeList />
      <Link href="/recipe/create">
        <Button className="text-slate-300">Create New Recipe</Button>
      </Link>
    </main>
  )
}
