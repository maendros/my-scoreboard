import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const teamQueryResolvers = {
  Query: {
    teams: async () => {
      try {        
        return await prisma.team.findMany();;
      } catch (error) {
        console.error("Error fetching teams:", error);
        return [];
      }
    },
  },
};

export default teamQueryResolvers;
