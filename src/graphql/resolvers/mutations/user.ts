import { PrismaClient } from "@prisma/client";
import { pubsub, MATCH_ADDED } from "@/graphql/pubsub";

const prisma = new PrismaClient();

const userMutationResolvers = {
  Mutation: {
    addUser: async (_: any, { user }: { user: any }) => {
      return await prisma.user.create({
        data: {
          name: user.name,
          email: user.email || null,
          profile: user.profile || {},
        },
      });
    },
    updateUser: async (_: any, { id, user }: { id: number; user: any }) => {
      return await prisma.user.update({
        where: { id },
        data: {
          name: user.name,
          profile: user.profile || {},
        },
      });
    },
    deleteUser: async (_: any, { id }: { id: number }) => {
      await prisma.user.delete({ where: { id } });
      return true;
    },
  },
};

export default userMutationResolvers;
