import { PrismaClient } from "@prisma/client";
import { subDays, formatISO } from "date-fns";
import { groupBy } from "lodash";

const prisma = new PrismaClient();

const fixtureQueryResolvers = {
  Query: {
    fixtures: async (_: any, { teamId }: { teamId?: number }) => {
      try {
        console.log("teamId", teamId);
        const fixtures = await prisma.fixture.findMany({
          where: {
            OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
          },
          include: {
            homeTeam: true,
            awayTeam: true,
          },
          orderBy: {
            playedAt: "desc",
          },
        });

        return fixtures;
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
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today

        const fixtures = await prisma.fixture.findMany({
          where: {
            ...(leagueId && { leagueId }),
            ...(daysLimit && {
              playedAt: {
                gte: formatISO(today), // If daysLimit is 1, start from today
              },
            }),
          },
          include: {
            homeTeam: true,
            awayTeam: true,
            league: true,
          },
          orderBy: {
            playedAt: "desc",
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
            OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
            ...(leagueId && { leagueId }), // Optional league filter
          },
          orderBy: { playedAt: "asc" }, // Ensure chronological order
          include: {
            homeTeam: true,
            awayTeam: true,
            league: true,
          },
        });

        // Calculate cumulative performance metrics
        let cumulativePoints = 0;
        let cumulativeGoalDifference = 0;

        const performanceData = fixtures.map((fixture, index) => {
          const isHomeTeam = fixture.homeTeamId === teamId;
          const teamScore = isHomeTeam ? fixture.homeScore : fixture.awayScore;
          const opponentScore = isHomeTeam
            ? fixture.awayScore
            : fixture.homeScore;

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
            opponent: isHomeTeam
              ? fixture.awayTeam.name
              : fixture.homeTeam.name,
            result:
              teamScore > opponentScore
                ? "Win"
                : teamScore < opponentScore
                ? "Loss"
                : "Draw",
            points,
            cumulativePoints,
            goalDifference: teamScore - opponentScore,
            cumulativeGoalDifference,
          };
        });

        return {
          teamId,
          leagueId,
          performanceData,
        };
      } catch (error) {
        console.error("Error fetching team performance:", error);
        throw new Error("Could not retrieve team performance data");
      }
    },

    leagueProgression: async (_: any, { leagueId }: { leagueId: number }) => {
      try {
        const fixtures = await prisma.fixture.findMany({
          where: {
            leagueId,
            homeScore: { gt: -1 },
            awayScore: { gt: -1 },
          },
          orderBy: { playedAt: "asc" },
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        });

        if (!fixtures.length) {
          return {
            leagueId,
            teams: [],
          };
        }

        const teamStandings = new Map();

        // Process each fixture
        fixtures.forEach((fixture, matchday) => {
          const processTeam = (
            teamId: number,
            teamName: string,
            isHome: boolean,
            matchday: number
          ) => {
            if (!teamStandings.has(teamId)) {
              teamStandings.set(teamId, {
                teamId,
                teamName,
                progression: [],
              });
            }

            const team = teamStandings.get(teamId);
            const score = isHome ? fixture.homeScore : fixture.awayScore;
            const opponentScore = isHome
              ? fixture.awayScore
              : fixture.homeScore;
            const points =
              score > opponentScore ? 3 : score === opponentScore ? 1 : 0;

            const previousPoints =
              team.progression.length > 0
                ? team.progression[team.progression.length - 1].points
                : 0;

            team.progression.push({
              matchday: matchday + 1,
              points: previousPoints + points,
              position: 0, // Will be calculated later
            });
          };

          processTeam(
            fixture.homeTeamId,
            fixture.homeTeam.name,
            true,
            matchday
          );
          processTeam(
            fixture.awayTeamId,
            fixture.awayTeam.name,
            false,
            matchday
          );
        });

        // Calculate positions for each matchday
        const matchdays = fixtures.length / 2;
        for (let matchday = 0; matchday < matchdays; matchday++) {
          // Fix: Make sure we have progression data for this matchday
          const teamsByPoints = Array.from(teamStandings.values())
            .filter((team) => team.progression[matchday]) // Add this check
            .sort((a, b) => {
              const aPoints = a.progression[matchday]?.points || 0;
              const bPoints = b.progression[matchday]?.points || 0;
              return bPoints - aPoints;
            });

          teamsByPoints.forEach((team, index) => {
            if (team.progression[matchday]) {
              team.progression[matchday].position = index + 1;
            }
          });
        }

        return {
          leagueId,
          teams: Array.from(teamStandings.values()),
        };
      } catch (error) {
        console.error("Error fetching league progression:", error);
        throw new Error("Could not retrieve league progression data");
      }
    },
  },
};

export default fixtureQueryResolvers;
