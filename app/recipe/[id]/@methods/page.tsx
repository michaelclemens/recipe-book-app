import MethodForm from '@/components/method/MethodForm'
import MethodList from '@/components/method/MethodList'

export default async function MethodsPage({ params: { id } }: { params: { id: string } }) {
  return (
    <div>
      <MethodForm recipeId={id} />
      <MethodList recipeId={id} />
    </div>
  )
}
