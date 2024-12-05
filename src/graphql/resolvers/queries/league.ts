import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const leagueQueryResolvers = {
  Query: {
    leagueTable: async (_: any, { leagueId }: { leagueId: number }) => {
      try {
        const leagueTeams = await prisma.leagueTeam.findMany({
          where: { leagueId },
          include: { team: true },
        });

        if (leagueTeams.length === 0) return [];

        const fixtures = await prisma.fixture.findMany({
          where: { leagueId },
          include: { homeTeam: true, awayTeam: true }, // Include team details
        });

        const table = leagueTeams.map(({ team }) => {
          const homeMatches = fixtures.filter(
            (fixture) => fixture.homeTeamId === team.id
          );
          const awayMatches = fixtures.filter(
            (fixture) => fixture.awayTeamId === team.id
          );

          const lastFiveMatches = [...homeMatches, ...awayMatches]
            .sort(
              (a, b) =>
                new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime()
            )
            .slice(0, 5);

          const played = homeMatches.length + awayMatches.length;
          const won =
            homeMatches.filter(
              (fixture) => fixture.homeScore > fixture.awayScore
            ).length +
            awayMatches.filter(
              (fixture) => fixture.awayScore > fixture.homeScore
            ).length;
          const drawn =
            homeMatches.filter(
              (fixture) => fixture.homeScore === fixture.awayScore
            ).length +
            awayMatches.filter(
              (fixture) => fixture.homeScore === fixture.awayScore
            ).length;
          const lost = played - won - drawn;
          const goalsFor =
            homeMatches.reduce((sum, match) => sum + match.homeScore, 0) +
            awayMatches.reduce((sum, match) => sum + match.awayScore, 0);
          const goalsAgainst =
            homeMatches.reduce((sum, match) => sum + match.awayScore, 0) +
            awayMatches.reduce((sum, match) => sum + match.homeScore, 0);
          const goalDifference = goalsFor - goalsAgainst;
          const points = won * 3 + drawn;
          const winRatio =
            played > 0 ? ((won + 0.5 * drawn) / played) * 100 : 0;

          return {
            team,
            played,
            won,
            drawn,
            lost,
            goalsFor,
            goalsAgainst,
            goalDifference,
            points,
            winRatio,
            lastFiveMatches: lastFiveMatches.map((match) => ({
              result:
                match.homeScore === match.awayScore
                  ? "draw"
                  : match.homeScore > match.awayScore
                  ? match.homeTeamId === team.id
                    ? "win"
                    : "loss"
                  : match.homeTeamId === team.id
                  ? "loss"
                  : "win",
            })),
          };
        });

        return table;
      } catch (error) {
        console.error("Error calculating league table:", error);
        return [];
      }
    },

    leagues: async () => {
      try {
        return await prisma.league.findMany({
          include: { teams: { include: { team: true } }, fixtures: true },
        });
      } catch (error) {
        console.error("Error fetching leagues:", error);
        return [];
      }
    },
    league: async (_: any, { id }: { id: number }) => {
      try {
        const league = await prisma.league.findUnique({
          where: { id },
          include: {
            teams: {
              include: {
                team: true,
              },
            },
          },
        });

        if (!league) {
          throw new Error("League not found");
        }

        // Format the response to include teams directly
        return {
          ...league,
          teams: league.teams.map((leagueTeam) => leagueTeam.team),
        };
      } catch (error) {
        console.error("Error fetching league:", error);
        throw new Error("Failed to fetch league");
      }
    },
  },
};

export default leagueQueryResolvers;
