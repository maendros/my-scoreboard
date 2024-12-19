import { makeExecutableSchema } from "@graphql-tools/schema";
import { applyMiddleware } from "graphql-middleware";
import { permissions } from "@/graphql/middleware/permissions";
import typeDefs from "@/graphql/typeDefs";
import resolvers from "@/graphql/resolvers";

const baseSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
console.log("baseSchema", baseSchema);
export const schema = applyMiddleware(baseSchema, permissions);
