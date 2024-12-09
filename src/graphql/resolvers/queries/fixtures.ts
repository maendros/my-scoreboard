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
          (fixture: Record<string, any>) =>
            fixture.playedAt.toISOString().split("T")[0] // Group by date (YYYY-MM-DD)
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

    teamPerformanceEvolution: async (
      _: any, 
      { teamId, leagueId }: { teamId: number; leagueId?: number }
    ) => {
      try {
        // Fetch all fixtures for the team
        const fixtures = await prisma.fixture.findMany({
          where: {
            OR: [
              { homeTeamId: teamId },
              { awayTeamId: teamId }
            ],
            ...(leagueId && { leagueId }) // Optional league filter
          },
          orderBy: { playedAt: 'asc' }, // Ensure chronological order
          include: {
            homeTeam: true,
            awayTeam: true,
            league: true
          }
        });
        console.log({fixtures});
        // Calculate cumulative performance metrics
        let cumulativePoints = 0;
        let cumulativeGoalDifference = 0;

        const performanceData = fixtures.map((fixture, index) => {
          const isHomeTeam = fixture.homeTeamId === teamId;
          const teamScore = isHomeTeam ? fixture.homeScore : fixture.awayScore;
          const opponentScore = isHomeTeam ? fixture.awayScore : fixture.homeScore;

          // Determine match result
          let points = 0;
          if (teamScore > opponentScore) points = 3; // Win
          if (teamScore === opponentScore) points = 1; // Draw

          // Cumulative calculations
          cumulativePoints += points;
          cumulativeGoalDifference += teamScore - opponentScore;

          return {
            matchNumber: index + 1,
            date: fixture.playedAt.toISOString().split("T")[0],
            opponent: isHomeTeam ? fixture.awayTeam.name : fixture.homeTeam.name,
            result: teamScore > opponentScore ? 'Win' : 
                    teamScore < opponentScore ? 'Loss' : 'Draw',
            points,
            cumulativePoints,
            goalDifference: teamScore - opponentScore,
            cumulativeGoalDifference
          };
        });
        console.log({performanceData});
        

        return {
          teamId,
          leagueId,
          performanceData
        };
      } catch (error) {
        console.error("Error fetching team performance:", error);
        throw new Error("Could not retrieve team performance data");
      }
    },
  },
};

export default fixtureQueryResolvers;
