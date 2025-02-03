import { SelectProps, Select as UiSelect } from '@headlessui/react'
import { ForwardedRef, forwardRef } from 'react'
import { FieldError } from 'react-hook-form'
import FieldErrorMessage from './FieldErrorMessage'

export default forwardRef(function Select(props: SelectProps & { error?: FieldError }, inputRef: ForwardedRef<HTMLInputElement>) {
  const { error } = props
  const inputProps = { ...props, error: undefined }
  return (
    <div className="block h-full grow">
      <UiSelect
        ref={inputRef}
        {...inputProps}
        className="h-full rounded-md border-0 bg-transparent py-0 pr-8 pl-3 text-center focus:ring-2 focus:ring-indigo-900 focus:ring-inset"
      >
        {props.children}
      </UiSelect>
      <FieldErrorMessage className="bottom-0 translate-y-6" error={error} />
    </div>
  )
})
