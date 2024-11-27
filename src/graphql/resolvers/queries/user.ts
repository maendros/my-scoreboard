import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userQueryResolvers = {
  Query: {
    users: async () => {
      try {
        return await prisma.user.findMany();
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    },
  },
};

export default userQueryResolvers;
