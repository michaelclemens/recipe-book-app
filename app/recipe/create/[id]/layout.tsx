export default async function RecipeLayout({
  children,
  ingredients,
  methods,
}: {
  params: { id: string }
  children: React.ReactNode
  ingredients: React.ReactNode
  methods: React.ReactNode
}) {
  return (
    <main className="-mt-5 flex h-full w-full flex-grow flex-col overflow-hidden pt-5">
      {children}
      <div className="grid h-full grid-cols-2 overflow-hidden p-5">
        {ingredients}
        {methods}
      </div>
    </main>
  )
}
