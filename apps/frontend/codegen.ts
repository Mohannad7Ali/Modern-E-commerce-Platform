import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  // graphqlserver url
  schema: 'http://localhost:7000/api/v1/graphql',
  // gql files locations
  documents: ['app/**/*.tsx', 'app/**/*.ts', 'gql/**/*.ts'],
  generates: {
    './gql/generated/': {
      preset: 'client',
      plugins: [],
    },
  },
}

export default config
