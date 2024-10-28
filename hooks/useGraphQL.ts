import { TypedDocumentString } from '@/gql/graphql'
import { useQuery } from '@tanstack/react-query'
import { ExecutionResult } from 'graphql'


export function useGraphQL<TResult, TVariables>(
  document: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  return useQuery({
    queryKey:
    [
      document,
      variables,
    ],
    queryFn: async ({ queryKey }) => {
      return fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: queryKey[0].toString(),
          variables: queryKey[1],
        }),
      }).then(response => response.json()) as Promise<ExecutionResult<TResult>>
    }
})
}
