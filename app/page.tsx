import Link from 'next/link'

export default async function Home() {
  return (
    <main className="flex h-full w-full items-center justify-center gap-20 xl:px-10">
      <Link href="/recipe" className="text-4xl">
        Recipe Book
      </Link>
      <Link href="/shopping" className="text-4xl">
        Shopping List
      </Link>
    </main>
  )
}
