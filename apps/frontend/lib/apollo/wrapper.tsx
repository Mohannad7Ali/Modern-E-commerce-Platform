'use client'

// HttpLink sends GraphQL requests
import { HttpLink } from '@apollo/client'

// ApolloNextAppProvider is the official provider for App Router
import { ApolloNextAppProvider, ApolloClient, InMemoryCache } from '@apollo/client-integration-nextjs'

/*
  makeClient creates a new ApolloClient instance.
  This runs on both server (during SSR)
  and in the browser (after hydration).
*/
function makeClient() {
  const httpLink = new HttpLink({
    uri:
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_GRAPHQL_URL_PROD
        : process.env.NEXT_PUBLIC_GRAPHQL_URL_DEV,

    // Needed if your API uses cookies / sessions
    credentials: 'include',
  })

  return new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Product: {
          fields: {
            variants: { merge: true },
          },
        },
      },
    }),

    link: httpLink,
  })
}

/*
  ApolloWrapper wraps your entire app.
  It injects Apollo into React context.
  Without this → useQuery will NOT work.
*/
export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>
}
