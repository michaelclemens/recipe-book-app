'use client'

import clsx from 'clsx'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { generatePagination } from '@/util/pagination'

export default function Pagination({ totalPages }: { totalPages: number }) {
  const { push } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1
  const allPages = generatePagination(currentPage, totalPages)

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  const onNavigate = (href: string) => {
    push(href)
  }

  function PaginationNumber({
    page,
    href,
    isActive,
    position,
  }: {
    page: number | string
    href: string
    position?: 'first' | 'last' | 'middle' | 'single'
    isActive: boolean
  }) {
    const className = clsx('flex h-10 w-10 items-center justify-center text-sm border border-slate-900 font-bold ', {
      'rounded-l-md': position === 'first' || position === 'single',
      'rounded-r-md': position === 'last' || position === 'single',
      'z-10 bg-slate-900 border-slate-400/20 text-slate-300': isActive,
      'text-slate-400 hover:bg-slate-800 transition-color duration-300': !isActive,
    })

    return isActive || position === 'middle' ? (
      <div className={className}>{page}</div>
    ) : (
      <button onClick={() => onNavigate(href)} className={className}>
        {page}
      </button>
    )
  }

  function PaginationArrow({ href, direction, isDisabled }: { href: string; direction: 'left' | 'right'; isDisabled?: boolean }) {
    const className = clsx('flex h-10 w-10 items-center justify-center rounded-md border border-slate-900 ', {
      'pointer-events-none text-slate-800': isDisabled,
      'hover:bg-slate-800 text-slate-400 transition-color duration-300': !isDisabled,
      'mr-2 md:mr-4': direction === 'left',
      'ml-2 md:ml-4': direction === 'right',
    })

    const icon = direction === 'left' ? <FaArrowLeft className="w-4" /> : <FaArrowRight className="w-4" />

    return isDisabled ? (
      <div className={className}>{icon}</div>
    ) : (
      <button className={className} onClick={() => onNavigate(href)}>
        {icon}
      </button>
    )
  }

  return (
    <>
      <div className="inline-flex">
        <PaginationArrow direction="left" href={createPageURL(currentPage - 1)} isDisabled={currentPage <= 1} />

        <div className="flex -space-x-px">
          {allPages.map((page, index) => {
            let position: 'first' | 'last' | 'single' | 'middle' | undefined

            if (index === 0) position = 'first'
            if (index === allPages.length - 1) position = 'last'
            if (allPages.length === 1) position = 'single'
            if (page === '...') position = 'middle'

            return <PaginationNumber key={page} href={createPageURL(page)} page={page} position={position} isActive={currentPage === page} />
          })}
        </div>

        <PaginationArrow direction="right" href={createPageURL(currentPage + 1)} isDisabled={currentPage >= totalPages} />
      </div>
    </>
  )
}
