import { HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import { prefetchMethods } from '@/hooks/recipe/useMethods'
import MethodListGuided from '@/components/method/MethodListGuided'

export default async function CookRecipePage({ params: { id } }: { params: { id: string } }) {
  const methods = await prefetchMethods(id)
  return (
    <HydrationBoundary state={methods}>
      <Suspense fallback="Loading...">
        <MethodListGuided recipeId={id} />
      </Suspense>
    </HydrationBoundary>
  )
}
