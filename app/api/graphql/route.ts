import { createYoga } from 'graphql-yoga'
import type { NextApiRequest, NextApiResponse } from 'next'
import { schema } from '@/lib/schema'

const { handleRequest } = createYoga<{
  req: NextApiRequest
  res: NextApiResponse
}>({
  schema,
  graphqlEndpoint: '/api/graphql',
})

export { handleRequest as GET, handleRequest as POST }
