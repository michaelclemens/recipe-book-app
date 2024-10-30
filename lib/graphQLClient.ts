import { GraphQLClient } from 'graphql-request'
import { cache } from 'react'

const getGraphQLClient = cache(() => new GraphQLClient(process.env.GRAPHQL_URL ?? ''))
export default getGraphQLClient
