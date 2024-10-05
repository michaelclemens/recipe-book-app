import { Permanent_Marker } from 'next/font/google'
import { ReactNode } from 'react'
import styles from './Polariod.module.css'

const marker = Permanent_Marker({ weight: '400', subsets: ['latin'], preload: true })

export default function Polariod({
  children,
  className = '',
  pinned = false,
  onClick,
}: {
  children: ReactNode
  className?: string
  pinned?: boolean
  onClick?: () => void
}) {
  return (
    <div className={`${marker.className} ${className} relative flex min-h-64 min-w-64 flex-col bg-yellow-50 px-4 pt-4 shadow-md`} onClick={onClick}>
      {pinned && <div className={styles.pinned} />}
      {children}
    </div>
  )
}
