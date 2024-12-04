import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const leagueQueryResolvers = {
  Query: {
    leagueTable: async (_: any, { leagueId }: { leagueId: number }) => {
      try {
        // Fetch teams in the league
        const leagueTeams = await prisma.leagueTeam.findMany({
          where: { leagueId },
          include: { team: true }, // Include the team details
        });

        if (leagueTeams.length === 0) return []; // No teams in the league

        const matches = await prisma.match.findMany({
          where: { leagueId },
        });

        const table = leagueTeams.map(({ team }) => {
          const homeMatches = matches.filter(
            (match) => match.homeTeamId === team.id
          );
          const awayMatches = matches.filter(
            (match) => match.awayTeamId === team.id
          );

          const played = homeMatches.length + awayMatches.length;
          const won =
            homeMatches.filter((match) => match.homeScore > match.awayScore)
              .length +
            awayMatches.filter((match) => match.awayScore > match.homeScore)
              .length;
          const drawn =
            homeMatches.filter((match) => match.homeScore === match.awayScore)
              .length +
            awayMatches.filter((match) => match.homeScore === match.awayScore)
              .length;
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
        
        return  await prisma.league.findMany({
          include: { teams: { include: { team: true } }, matches: true },
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
