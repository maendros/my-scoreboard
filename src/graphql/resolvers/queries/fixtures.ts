import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fixtureQueryResolvers = {
  Query: {
    fixtures: async (_: any, { leagueId }: { leagueId?: number }) => {
      try {
        // Fetch matches with optional league filtering
        const fixtures = await prisma.fixture.findMany({
          where: leagueId ? { leagueId } : undefined, // Filter by leagueId if provided
          include: { homeTeam: true, awayTeam: true, league: true }, // Include related data
        });

        return fixtures.map((fixture) => ({
          ...fixture,
          league: fixture.league || null, // Handle optional league association
        }));
      } catch (error) {
        console.error("Error fetching fixtures:", error);
        return [];
      }
    },
  },
};

export default fixtureQueryResolvers;
