import { CheckboxProps, Field, Label, Checkbox as UiCheckbox } from '@headlessui/react'
import { ForwardedRef, forwardRef } from 'react'
import { FieldError } from 'react-hook-form'
import { FaCheck } from 'react-icons/fa'
import FieldErrorMessage from './FieldErrorMessage'
import styles from './Input.module.css'

export default forwardRef(function Checkbox(props: CheckboxProps & { label?: string; error?: FieldError }, inputRef: ForwardedRef<HTMLInputElement>) {
  const { error } = props
  const inputProps = { ...props, label: undefined, error: undefined }
  return (
    <>
      <Field className="relative flex">
        <Label className="absolute -translate-y-5 text-xs">{props.label}</Label>
        <UiCheckbox
          ref={inputRef}
          {...inputProps}
          className={`${styles.input} ${props.className} group size-6 rounded-md border-0 bg-slate-900 p-1 shadow-sm ring-1 ring-inset ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-indigo-900`}
        >
          <FaCheck className="mx-auto mt-0.5 hidden size-3 text-green-500 group-data-[checked]:block" />
        </UiCheckbox>
        <FieldErrorMessage error={error} />
      </Field>
    </>
  )
})
