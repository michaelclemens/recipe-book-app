export const sortByDate = (a: { createdAt: Date | string }, b: { createdAt: Date | string }) =>
  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()

export const sortByOrder = (a: { order: number | null; createdAt: Date | string }, b: { order: number | null; createdAt: Date | string }) => {
  if (a.order && b.order) return a.order - b.order
  return sortByDate(a, b)
}
