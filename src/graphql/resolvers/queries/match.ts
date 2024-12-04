import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const matchQueryResolvers = {
  Query: {
    matches: async (_: any, { leagueId }: { leagueId?: number }) => {
      try {
        // Fetch matches with optional league filtering
        const matches = await prisma.match.findMany({
          where: leagueId ? { leagueId } : undefined, // Filter by leagueId if provided
          include: { homeTeam: true, awayTeam: true, league: true }, // Include related data
        });

        return matches.map((match) => ({
          ...match,
          league: match.league || null, // Handle optional league association
        }));
      } catch (error) {
        console.error("Error fetching matches:", error);
        return [];
      }
    },
  },
};

export default matchQueryResolvers;
