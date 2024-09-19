import { ButtonProps, Button as UiButton } from '@headlessui/react'

export default function Button(props: ButtonProps) {
  return (
    <UiButton
      {...props}
      className={`${props.className} rounded-md bg-slate-900 px-3 py-2.5 text-slate-500 shadow-sm ring-1 ring-inset ring-indigo-900 transition-colors duration-500 enabled:hover:bg-slate-800 disabled:select-none disabled:opacity-50`}
    >
      {props.children}
    </UiButton>
  )
}
