import { createYoga } from "graphql-yoga";
import { schema } from "@/lib/schema";
import { createContext } from "@/lib/context";

// Choose one of these depending on your needs:
export const runtime = "edge"; // For Edge Runtime
// export const runtime = 'nodejs';  // For Node.js Runtime

const { handleRequest } = createYoga({
  schema,
  context: createContext,
  graphqlEndpoint: "/api/graphql",
  logging: {
    debug: (...args) => console.log(...args),
    info: (...args) => console.log(...args),
    warn: (...args) => console.warn(...args),
    error: (...args) => console.error(...args),
  },
});

export { handleRequest as GET, handleRequest as POST };
