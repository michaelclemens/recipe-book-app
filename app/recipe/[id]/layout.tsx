import { Provider } from 'jotai'

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
    <Provider>
      <main className="flex h-full w-full flex-grow flex-col overflow-hidden">
        {children}
        <div className="grid h-full grid-cols-2 gap-5 overflow-hidden">
          {ingredients}
          {methods}
        </div>
      </main>
    </Provider>
  )
}
