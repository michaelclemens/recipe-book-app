import MethodForm from '@/components/method/MethodForm'
import MethodList from '@/components/method/MethodList'

export default async function MethodsPage({ params: { id } }: { params: { id: string } }) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <MethodForm recipeId={id} />
      <MethodList recipeId={id} />
    </div>
  )
}
