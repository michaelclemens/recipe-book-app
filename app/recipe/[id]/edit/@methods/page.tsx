import { HydrationBoundary } from '@tanstack/react-query'
import { prefetchMethods } from '@/hooks/recipe/useMethods'
import MethodForm from '@/components/method/MethodForm'
import MethodList from '@/components/method/MethodList'
import Paper from '@/components/ui/Paper'

export default async function MethodsPage({ params: { id } }: { params: { id: string } }) {
  const methods = await prefetchMethods(id)
  return (
    <div className="flex flex-col overflow-hidden">
      <Paper>
        <div className="mb-7 underline underline-offset-4">Methods</div>
        <MethodForm recipeId={id} />
        <HydrationBoundary state={methods}>
          <MethodList recipeId={id} />
        </HydrationBoundary>
      </Paper>
    </div>
  )
}
