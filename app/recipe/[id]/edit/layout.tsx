import { HydrationBoundary } from '@tanstack/react-query'
import { prefetchRecipe } from '@/hooks/recipe/useRecipe'

export default async function RecipeLayout({
  params: { id },
  children,
  ingredients,
  methods,
}: {
  params: { id: string }
  children: React.ReactNode
  ingredients: React.ReactNode
  methods: React.ReactNode
}) {
  const recipe = await prefetchRecipe(id)
  return (
    <HydrationBoundary state={recipe}>
      <main className="-mt-5 flex h-full w-full flex-grow flex-col overflow-hidden pt-5">
        {children}
        <div className="grid h-full grid-cols-2 overflow-hidden p-5">
          {ingredients}
          {methods}
        </div>
      </main>
    </HydrationBoundary>
  )
}
