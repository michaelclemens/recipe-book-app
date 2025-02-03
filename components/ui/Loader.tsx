import { FaSpinner } from 'react-icons/fa'

export default function Loader() {
  return (
    <div className="absolute top-0 left-0 z-50 flex h-full w-full animate-pulse items-center justify-center bg-slate-400/20 select-none">
      <FaSpinner title="Loading..." className="animate-spin text-slate-200/70" size="2em" />
    </div>
  )
}
