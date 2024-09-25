export default async function CookRecipeLayout({
  children,
  ingredients,
}: {
  params: { id: string }
  children: React.ReactNode
  ingredients: React.ReactNode
}) {
  return (
    <main className="flex h-full w-full overflow-hidden">
      {ingredients}
      {children}
    </main>
  )
}
