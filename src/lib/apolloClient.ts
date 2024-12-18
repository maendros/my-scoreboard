import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "/api/graphql",
  credentials: "same-origin",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Cache leagues query but expire after 5 minutes
        leagues: {
          keyArgs: false,
          merge(existing, incoming) {
            return incoming;
          },
        },
        // Cache teams query but expire after 5 minutes
        teams: {
          keyArgs: false,
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network", // Use cache but verify against network
      nextFetchPolicy: "cache-first", // Use cache for subsequent requests
    },
    query: {
      fetchPolicy: "cache-first", // Use cache when available
      errorPolicy: "all", // Handle partial errors
    },
    mutate: {
      fetchPolicy: "no-cache", // Never cache mutations
    },
  },
});

export default client;
