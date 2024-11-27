import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const matchQueryResolvers = {
  Query: {
    matches: async () => {
      try {
        return await prisma.match.findMany({
          include: { homeTeam: true, awayTeam: true },
        });
      } catch (error) {
        console.error("Error fetching matches:", error);
        return [];
      }
    },
  },
};

export default matchQueryResolvers;
