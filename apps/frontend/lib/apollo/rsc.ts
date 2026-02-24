/*
  Apollo for Server Components
*/
// HttpLink is responsible for sending requests to your GraphQL server
import { HttpLink } from '@apollo/client'

// These utilities are specifically built for Next.js App Router
import { registerApolloClient, ApolloClient, InMemoryCache } from '@apollo/client-integration-nextjs'

/*
  registerApolloClient creates a special Apollo client
  that works correctly with React Server Components (RSC).
*/
export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  /*
    This function returns a NEW ApolloClient instance.
    In RSC, every request should have its own isolated client.
  */
  return new ApolloClient({
    /*
      InMemoryCache stores GraphQL results in memory.
      It prevents unnecessary network requests.
    */
    cache: new InMemoryCache({
      /*
        typePolicies allow you to customize how Apollo merges data.
        Here we are telling Apollo:
        When Product.variants is fetched again → merge it instead of replacing.
      */
      typePolicies: {
        Product: {
          fields: {
            variants: { merge: true },
          },
        },
      },
    }),

    /*
      HttpLink defines where your GraphQL API lives.
    */
    link: new HttpLink({
      uri:
        process.env.NODE_ENV === 'production'
          ? process.env.NEXT_PUBLIC_GRAPHQL_URL_PROD
          : process.env.NEXT_PUBLIC_GRAPHQL_URL_DEV,

      // Include cookies in requests (important for auth)
      credentials: 'include',

      /*
        fetchOptions with next: { revalidate: 60 }
        means:
        Cache this request on the server for 60 seconds.
      */
      fetchOptions: {
        next: { revalidate: 60 },
      },
    }),
  })
})

/**
 * usage in a server component (e.g. app/page.tsx):
import { query } from "@/lib/apollo/rsc";
export default async function Page() {
  const { data } = await query({
    query: QUERY_NAME, // Your GraphQL query document
  });

  return <div>{data.products.length}</div>;
}

 */
