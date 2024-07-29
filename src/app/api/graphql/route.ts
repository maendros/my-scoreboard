import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { PrismaClient } from "@prisma/client";
import typeDefs from "@/graphql/typeDefs";
import resolvers from "@/graphql/resolvers";
import { IncomingMessage } from "http";
import { Context } from "@/types/context";

const prisma = new PrismaClient();

const server = new ApolloServer<{
  req: IncomingMessage;
  prisma: PrismaClient;
}>({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async ({ req }: { req: IncomingMessage }): Promise<Context> => {
    return { prisma, req };
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export { handler as POST };
