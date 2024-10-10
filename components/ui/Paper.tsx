'use client'

import { motion, MotionProps } from 'framer-motion'
import { Nothing_You_Could_Do } from 'next/font/google'
import { ForwardedRef, forwardRef, useCallback, useEffect, useRef } from 'react'
import { FieldError, RefCallBack } from 'react-hook-form'
import FieldErrorMessage from './FieldErrorMessage'
import styles from './Paper.module.css'

const nothingYouCouldDo = Nothing_You_Could_Do({ weight: '400', subsets: ['latin'] })

type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
type TextareaProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>

const PaperInputComponent = (props: InputProps & { error?: FieldError }, inputRef: ForwardedRef<HTMLInputElement>) => (
  <>
    <input ref={inputRef} {...props} className={`border-none bg-transparent p-0 text-2xl leading-7 focus:ring-0 ${props.className ?? ''}`} />
    <FieldErrorMessage error={props.error} />
  </>
)

export const PaperInput = forwardRef(PaperInputComponent)

const PaperTextareaComponent = (props: TextareaProps & { error?: FieldError }, inputRef: ForwardedRef<RefCallBack>) => {
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
    <>
      <textarea
        ref={e => {
          inputRef && typeof inputRef === 'function' && inputRef(e as unknown as RefCallBack)
          textareaRef.current = e
        }}
        rows={1}
        {...props}
        className={`${props.className ?? ''} overflow-hidden border-none bg-transparent p-0 text-2xl leading-7 focus:ring-0`}
        onChange={fixHeight}
      />
      <FieldErrorMessage error={props.error} />
    </>
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
