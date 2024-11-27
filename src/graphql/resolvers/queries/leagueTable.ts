import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const leagueTableQueryResolvers = {
  Query: {
    leagueTable: async () => {
      try {
        const users = await prisma.user.findMany();
        const matches = await prisma.match.findMany();

        if (users.length === 0) return []; // No users

        const table = users.map((user) => {
          const homeMatches = matches.filter(
            (match) => match.homeTeamId === user.id
          );
          const awayMatches = matches.filter(
            (match) => match.awayTeamId === user.id
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
            team: user,
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
  },
};

export default leagueTableQueryResolvers;
