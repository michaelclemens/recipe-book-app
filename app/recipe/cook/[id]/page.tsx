import { getMethods, getRecipe } from '@/lib/client'
import MethodListGuided from '@/components/method/MethodListGuided'

export default async function CookRecipePage({
  params: { id },
  searchParams: { step },
}: {
  params: { id: string }
  searchParams: { step?: string }
}) {
  const recipe = await getRecipe(id)
  const methods = await getMethods(id)
  const currentStep = step ? Number(step) : 1
  return (
    <div className="flex h-full w-full flex-col justify-center overflow-hidden p-10">
      <MethodListGuided recipeId={id} methods={methods} currentStep={currentStep} />
    </div>
  )
}
