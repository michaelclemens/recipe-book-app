'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'

export default function useFilterParams() {
  const { push } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : undefined
  const query = searchParams.get('query') ?? undefined

  const form = useForm({ defaultValues: { search: query ?? undefined } })

  const onSearch = async ({ search }: { search?: string }) => {
    if (search) {
      const params = new URLSearchParams()
      params.set('query', search)
      push(`${pathname}?${params.toString()}`)
    } else {
      push(pathname)
    }
  }

  return { filter: { page, query }, form, onSearch }
}
