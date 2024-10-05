import { motion, MotionProps } from 'framer-motion'
import { ReactNode } from 'react'
import styles from './PostIt.module.css'

export default function PostIt({ children, className = '', motionProps }: { children: ReactNode; className?: string; motionProps?: MotionProps }) {
  return (
    <motion.div {...motionProps} className={`${styles.postIt} ${className}`}>
      {children}
    </motion.div>
  )
}
