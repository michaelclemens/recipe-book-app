import { GraphQLClient } from 'graphql-request'
import { cache } from 'react'

const graphqlURL = process.env.GRAPHQL_URL
const getGraphQLClient = cache(() => new GraphQLClient(graphqlURL ?? 'http://localhost:3000/api/graphql'))
export default getGraphQLClient
