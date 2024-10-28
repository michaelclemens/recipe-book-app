import type { CodegenConfig } from '@graphql-codegen/cli'
import { printSchema } from 'graphql'
import { schema } from './lib/schema'

const config: CodegenConfig = {
  overwrite: true,
  schema: printSchema(schema),
  documents: ['components/**/*.tsx', 'app/**/*.tsx'],
  generates: {
    './gql/': {
      preset: 'client',
      config: {
        documentMode: 'string',
      },
    },
  },
  hooks: { afterAllFileWrite: ['prettier --write'] },
}

export default config
