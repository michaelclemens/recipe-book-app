'use client'

import { Input, InputProps, Textarea, TextareaProps } from '@headlessui/react'
import { motion, MotionProps } from 'framer-motion'
import { Nothing_You_Could_Do } from 'next/font/google'
import { ForwardedRef, forwardRef, useCallback, useEffect, useRef } from 'react'
import { RefCallBack } from 'react-hook-form'
import styles from './Paper.module.css'

const nothingYouCouldDo = Nothing_You_Could_Do({ weight: '400', subsets: ['latin'] })

const PaperInputComponent = (props: InputProps, inputRef: ForwardedRef<HTMLInputElement>) => (
  <Input ref={inputRef} {...props} className={`${props.className ?? ''} border-none bg-transparent p-0 text-2xl leading-7 focus:ring-0`} />
)
export const PaperInput = forwardRef(PaperInputComponent)

const PaperTextareaComponent = (props: TextareaProps, inputRef: ForwardedRef<RefCallBack>) => {
  const textareaRef = useRef<HTMLElement | null>(null)

  const fixHeight = useCallback(() => {
    if (!textareaRef.current) return
    textareaRef.current.style.height = ''
    textareaRef.current.style.height = `${Math.round(textareaRef.current.scrollHeight / 28) * 28}px`
  }, [textareaRef])

  useEffect(() => {
    fixHeight()
  }, [fixHeight])

  return (
    <Textarea
      ref={e => {
        inputRef && typeof inputRef === 'function' && inputRef(e as any)
        textareaRef.current = e
      }}
      rows={1}
      {...props}
      className={`${props.className ?? ''} overflow-hidden border-none bg-transparent p-0 text-2xl leading-7 focus:ring-0`}
      onChange={fixHeight}
    />
  )
}
export const PaperTextarea = forwardRef(PaperTextareaComponent)

export const PaperRow = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`${className} w-full`}>{children}</div>
)

export default function Paper({
  children,
  className = '',
  lined = true,
  taped = true,
  motionProps,
}: {
  children: React.ReactNode
  className?: string
  lined?: boolean
  taped?: boolean
  motionProps?: MotionProps
}) {
  return (
    <motion.div {...motionProps} className={`${className} relative flex max-h-full p-5`}>
      {taped && <div className={`${styles.tape}`} />}
      <div className={`${styles.paper} ${lined ? styles.lined : ''} h-full w-full`}>
        <div className={`${nothingYouCouldDo.className} flex h-full flex-col pb-7 pr-3 text-2xl leading-7 text-neutral-950`}>{children}</div>
      </div>
    </motion.div>
  )
}
