import { getMethods } from '@/lib/client'
import { MethodListWrapper } from './MethodListItem'

export default async function MethodList({ recipeId }: { recipeId: string }) {
  const methods = await getMethods(recipeId)
  return (
    <ol className="mt-7 h-screen list-decimal space-y-5 overflow-y-auto pr-3 scrollbar scrollbar-track-transparent scrollbar-thumb-slate-800">
      <MethodListWrapper methods={methods} />
    </ol>
  )
}
