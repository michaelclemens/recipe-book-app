import { createShoppingListAction } from '@/lib/client/shopping'

export default async function ShoppingHome() {
  return (
    <main className="h-full w-full xl:px-10">
      <form action={createShoppingListAction} className="flex flex-col gap-y-10">
        <input name="name" placeholder="Shopping list name..." className="text-neutral-950" required />
        <button>Create shopping list</button>
      </form>
    </main>
  )
}
