'use client'

import { ButtonProps } from '@headlessui/react'
import { useFormStatus } from 'react-dom'
import Button from './Button'

export default function SubmitButton(props: ButtonProps) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} {...props}>
      {props.children}
    </Button>
  )
}
