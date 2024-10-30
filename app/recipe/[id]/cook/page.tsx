import { HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import { prefetchMethods } from '@/hooks/recipe/useMethods'
import MethodListGuided from '@/components/method/MethodListGuided'

export default async function CookRecipePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params

  const { id } = params

  const methods = await prefetchMethods(id)
  return (
    <HydrationBoundary state={methods}>
      <Suspense fallback="Loading...">
        <MethodListGuided recipeId={id} />
      </Suspense>
    </HydrationBoundary>
  )
}
