import { HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import { prefetchMethods } from '@/hooks/recipe/useMethods'
import MethodForm from '@/components/method/MethodForm'
import MethodList from '@/components/method/MethodList'
import Paper from '@/components/ui/Paper'

export default async function MethodsPage({ params: { id } }: { params: { id: string } }) {
  const methods = await prefetchMethods(id)
  return (
    <div className="flex flex-col xl:col-span-3 xl:overflow-hidden">
      <Paper>
        <div className="mb-7 underline underline-offset-4">Methods</div>
        <MethodForm recipeId={id} />
        <HydrationBoundary state={methods}>
          <Suspense fallback="Loading...">
            <MethodList recipeId={id} />
          </Suspense>
        </HydrationBoundary>
      </Paper>
    </div>
  )
}
