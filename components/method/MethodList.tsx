import { getMethods } from '@/lib/client'
import { MethodListWrapper } from './MethodListItem'

export default async function MethodList({ recipeId }: { recipeId: string }) {
  const methods = await getMethods(recipeId)
  return (
    <ol className="mt-7 list-decimal space-y-2">
      <MethodListWrapper methods={methods} />
    </ol>
  )
}
