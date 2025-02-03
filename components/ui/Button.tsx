import { ButtonProps, Button as UiButton } from '@headlessui/react'

export default function Button(props: ButtonProps) {
  return (
    <UiButton
      {...props}
      className={`${props.className} rounded-md bg-slate-900 px-3 py-2.5 text-slate-500 ring-1 shadow-sm ring-indigo-900 transition-colors duration-500 ring-inset enabled:hover:bg-slate-800 disabled:opacity-50 disabled:select-none`}
    >
      {props.children}
    </UiButton>
  )
}
