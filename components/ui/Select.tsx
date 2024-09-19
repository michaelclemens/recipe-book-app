import { SelectProps, Select as UiSelect } from '@headlessui/react'
import { ForwardedRef, forwardRef } from 'react'
import { FieldError } from 'react-hook-form'
import FieldErrorMessage from './FieldErrorMessage'

export default forwardRef(function Select(props: SelectProps & { error?: FieldError }, inputRef: ForwardedRef<HTMLInputElement>) {
  const { error } = props
  const inputProps = { ...props, error: undefined }
  return (
    <div className="h-full">
      <UiSelect
        ref={inputRef}
        {...inputProps}
        className="h-full rounded-md border-0 bg-transparent py-0 pl-3 pr-8 text-center focus:ring-2 focus:ring-inset focus:ring-indigo-900"
      />
      <FieldErrorMessage className="bottom-0 translate-y-6" error={error} />
    </div>
  )
})
