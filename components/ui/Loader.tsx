import { FaSpinner } from 'react-icons/fa'

export default function Loader() {
  return (
    <div className="absolute left-0 top-0 z-50 flex h-full w-full animate-pulse select-none items-center justify-center bg-slate-400/20">
      <FaSpinner title="Loading..." className="animate-spin text-slate-200/70" size="2em" />
    </div>
  )
}
