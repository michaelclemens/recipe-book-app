import { Permanent_Marker } from 'next/font/google'
import { ReactNode } from 'react'
import styles from './Polariod.module.css'

const marker = Permanent_Marker({ weight: '400', subsets: ['latin'], preload: true })

const randomRotate = (min = -12, max = 12) => Math.round(Math.random() * (max - min)) + min

export default function Polariod({
  children,
  className = '',
  pinned = false,
  taped = false,
  onClick,
}: {
  children: ReactNode
  className?: string
  pinned?: boolean
  taped?: boolean
  onClick?: () => void
}) {
  // const rotate = randomRotate()
  // console.log(rotate)

  return (
    <div
      className={`${marker.className} ${className} relative flex min-h-64 min-w-64 flex-col bg-yellow-50 px-4 pt-4 shadow-md`}
      onClick={onClick}
      // style={{ rotate: `${rotate}deg` }}
    >
      {pinned && <div className={styles.pinned} />}
      {children}
    </div>
  )
}
