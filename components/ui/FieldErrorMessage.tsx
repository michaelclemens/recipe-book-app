import { FieldError } from 'react-hook-form'

export default function FieldErrorMessage({ error, className }: { error?: FieldError; className?: string }) {
  if (!error) return
  return (
    <p role="alert" className={`my-auto flex shrink-0 items-center text-xs font-semibold text-red-700 italic ${className ?? ''}`}>
      {error.message}
    </p>
  )
}
