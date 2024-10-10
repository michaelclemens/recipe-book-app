import { HydrationBoundary } from '@tanstack/react-query'
import { prefetchMethods } from '@/hooks/useMethods'
import MethodListGuided from '@/components/method/MethodListGuided'

export default async function CookRecipePage({ params: { id } }: { params: { id: string } }) {
  const methods = await prefetchMethods(id)
  return (
    <HydrationBoundary state={methods}>
      <MethodListGuided recipeId={id} />
    </HydrationBoundary>
  )
}
