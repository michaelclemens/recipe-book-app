import { FieldError } from 'react-hook-form'

export default function FieldErrorMessage({ error, className }: { error?: FieldError; className?: string }) {
  if (!error) return
  return (
    <p role="alert" className={`${className} absolute my-1 ml-1 text-xs font-semibold italic text-red-700`}>
      {error.message}
    </p>
  )
}
