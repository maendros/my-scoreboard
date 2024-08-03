import { PubSub } from "graphql-subscriptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const pubsub = new PubSub();

const MATCH_ADDED = "MATCH_ADDED";

const resolvers = {
  Query: {
    users: () => prisma.user.findMany(),
    matches: () =>
      prisma.match.findMany({ include: { homeTeam: true, awayTeam: true } }),
    leagueTable: async () => {
      const users = await prisma.user.findMany();
      const matches = await prisma.match.findMany();

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

        // Calculate win ratio
        const winRatio = ((won + 0.5 * drawn) / played) * 100;

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
          winRatio, // Include the calculated win ratio
        };
      });

      return table.sort(
        (a, b) =>
          b.points - a.points ||
          b.goalDifference - a.goalDifference ||
          b.goalsFor - a.goalsFor
      );
    },
  },
  Mutation: {
    addMatch: async (
      _: any,
      {
        homeTeamId,
        awayTeamId,
        homeScore,
        awayScore,
        playedAt,
        userTeamIds, // New argument for user teams
      }: {
        homeTeamId: number;
        awayTeamId: number;
        homeScore: number;
        awayScore: number;
        playedAt: Date;
        userTeamIds?: { userId: number; teamId: number; isWinner: boolean }[]; // New argument for user teams
      }
    ) => {
      const match = await prisma.match.create({
        data: {
          homeTeamId,
          awayTeamId,
          homeScore,
          awayScore,
          playedAt,
          userTeams: {
            create: userTeamIds?.map(({ userId, teamId, isWinner }) => ({
              userId,
              teamId,
              isWinner,
            })),
          },
        },
      });
      pubsub.publish(MATCH_ADDED, { matchAdded: match });
      return match;
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
    playedAt: (parent: any) => new Date(parent.playedAt).toLocaleDateString(),
  },
};

export default resolvers;
