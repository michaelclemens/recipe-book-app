import { getMethods, getRecipe } from '@/lib/client'
import MethodListGuided from '@/components/method/MethodListGuided'

export default async function CookRecipePage({ params: { id } }: { params: { id: string } }) {
  await getRecipe(id)
  const methods = await getMethods(id)
  return (
    <div className="flex h-full w-full flex-col justify-center overflow-hidden p-10">
      <MethodListGuided methods={methods} />
    </div>
  )
}
