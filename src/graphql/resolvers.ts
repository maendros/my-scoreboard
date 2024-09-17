import { PubSub } from "graphql-subscriptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const pubsub = new PubSub();

const MATCH_ADDED = "MATCH_ADDED";

const resolvers = {
  Query: {
    users: async () => {
      try {
        return await prisma.user.findMany();
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    },
    matches: async () => {
      try {
        const matches = await prisma.match.findMany({
          include: { homeTeam: true, awayTeam: true },
        });
        return matches;
      } catch (error) {
        console.error("Error fetching matches:", error);
        return [];
      }
    },
    leagueTable: async () => {
      try {
        
        const users = await prisma.user.findMany();
        const matches = await prisma.match.findMany();
        
        if (users.length === 0) {
          return []; // No users, return empty array
        }

        const table = users.map((user) => {
          const homeMatches = matches.filter(
            (match) => match.homeTeamId === user.id
          );
          const awayMatches = matches.filter(
            (match) => match.awayTeamId === user.id
          );
          const played = homeMatches.length + awayMatches.length;
          const won =
            homeMatches.filter((match) => match.homeScore > match.awayScore).length +
            awayMatches.filter((match) => match.awayScore > match.homeScore).length;
          const drawn =
            homeMatches.filter((match) => match.homeScore === match.awayScore).length +
            awayMatches.filter((match) => match.homeScore === match.awayScore).length;
          const lost = played - won - drawn;
          const goalsFor =
            homeMatches.reduce((sum, match) => sum + match.homeScore, 0) +
            awayMatches.reduce((sum, match) => sum + match.awayScore, 0);
          const goalsAgainst =
            homeMatches.reduce((sum, match) => sum + match.awayScore, 0) +
            awayMatches.reduce((sum, match) => sum + match.homeScore, 0);
          const goalDifference = goalsFor - goalsAgainst;
          const points = won * 3 + drawn;
          const winRatio = played > 0 ? ((won + 0.5 * drawn) / played) * 100 : 0;

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
  Mutation: {
    addMatches: async (_: any, { matches }: { matches: any[] }) => {
      try {
        const createdMatches = await Promise.all(
          matches.map(async (match) => {
            return await prisma.match.create({
              data: {
                homeTeamId: parseInt(match.homeTeamId, 10), // Ensure integer type
                awayTeamId: parseInt(match.awayTeamId, 10),
                homeScore: match.homeScore,
                awayScore: match.awayScore,
                playedAt: new Date(match.playedAt),
                userTeams: match.userTeams
                  ? {
                      create: match.userTeams.map((userTeam: any) => ({
                        userId: parseInt(userTeam.userId, 10), // Ensure integer type
                        teamId: parseInt(userTeam.teamId, 10),
                        isWinner: userTeam.isWinner,
                      })),
                    }
                  : undefined,
              },
            });
          })
        );

        pubsub.publish(MATCH_ADDED, { matchAdded: createdMatches });
        return createdMatches;
      } catch (error) {
        console.error("Error adding matches:", error);
        throw new Error("Error adding matches");
      }
    },
  },
  Subscription: {
    matchAdded: {
      subscribe: () => pubsub.asyncIterator([MATCH_ADDED]),
    },
  },
  Match: {
    homeTeam: (parent: any) =>
      prisma.user.findUnique({ where: { id: parent.homeTeamId } }),
    awayTeam: (parent: any) =>
      prisma.user.findUnique({ where: { id: parent.awayTeamId } }),
    playedAt: (parent: any) => new Date(parent.playedAt).toISOString(),
  },
};

export default resolvers;
