import { PrismaClient } from "@prisma/client";
import { subDays, formatISO } from "date-fns";
import { groupBy } from "lodash";

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
    groupedFixtures: async (
      _: any,
      { leagueId, daysLimit }: { leagueId?: number; daysLimit?: number }
    ) => {
      try {
        const startDate = daysLimit
          ? subDays(new Date(), daysLimit) // Calculate the start date
          : undefined;

        const fixtures = await prisma.fixture.findMany({
          where: {
            ...(leagueId && { leagueId }), // Filter by leagueId if provided
            ...(startDate && { playedAt: { gte: formatISO(startDate) } }), // Filter by date if daysLimit is provided
          },
          include: {
            homeTeam: true,
            awayTeam: true,
            league: true,
          },
        });

        const groupedByDay = groupBy(
          fixtures,
          (fixture) => fixture.playedAt.toISOString().split("T")[0] // Group by date (YYYY-MM-DD)
        );

        return Object.entries(groupedByDay).map(([day, matches]) => ({
          day,
          matches,
        }));
      } catch (error) {
        console.error("Error fetching grouped fixtures:", error);
        return [];
      }
    },
  },
};

export default fixtureQueryResolvers;
