import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { PrismaClient } from "@prisma/client";
import typeDefs from "@/graphql/typeDefs";
import resolvers from "@/graphql/resolvers";
import { NextRequest } from "next/server";
import { Context } from "@/types/context";

const prisma = new PrismaClient();

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest): Promise<Context> => {
    return { prisma, req };
  },
});

export { handler as POST };
