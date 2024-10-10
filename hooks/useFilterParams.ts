'use client'

import { useSearchParams } from 'next/navigation'

export default function useFilterParams() {
  const searchParams = useSearchParams()
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : undefined
  const query = searchParams.get('query') ?? undefined
  return { page, query }
}
