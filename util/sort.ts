export const sortByDate = (a: { createdAt: Date }, b: { createdAt: Date }) => a.createdAt.getTime() - b.createdAt.getTime()

export const sortByOrder = (a: { order: number | null; createdAt: Date }, b: { order: number | null; createdAt: Date }) => {
  if (a.order && b.order) return a.order - b.order
  return sortByDate(a, b)
}
