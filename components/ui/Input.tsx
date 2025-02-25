import { InputProps, Input as UiInput } from '@headlessui/react'
import { ForwardedRef, forwardRef } from 'react'
import { FieldError } from 'react-hook-form'
import FieldErrorMessage from './FieldErrorMessage'
import styles from './Input.module.css'

export default forwardRef(function Input(props: InputProps & { error?: FieldError }, inputRef: ForwardedRef<HTMLInputElement>) {
  const { error } = props
  const inputProps = { ...props, error: undefined }
  return (
    <div className="block grow">
      <UiInput
        ref={inputRef}
        {...inputProps}
        className={`${styles.input} ${props.className} block w-full rounded-md border-0 bg-slate-900 px-3 py-1.5 shadow-sm ring-1 ring-slate-700 ring-inset focus:ring-2 focus:ring-indigo-900 focus:ring-inset`}
      />
      <FieldErrorMessage error={error} />
    </div>
  )
})
