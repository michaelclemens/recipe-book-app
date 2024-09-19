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
    <main className="px-5">
      {children}
      <div className="grid grid-cols-2 gap-5">
        {ingredients}
        {methods}
      </div>
    </main>
  )
}
