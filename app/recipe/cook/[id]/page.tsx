import { getMethods } from '@/lib/client'
import MethodListGuided from '@/components/method/MethodListGuided'

export default async function CookRecipePage({ params: { id } }: { params: { id: string } }) {
  const methods = await getMethods(id)
  return <MethodListGuided methods={methods} />
}
