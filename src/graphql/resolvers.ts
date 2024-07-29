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
  },
  Mutation: {
    addUser: async (
      _: any,
      { name, email }: { name: string; email: string }
    ) => {
      return prisma.user.create({
        data: {
          name,
          email,
        },
      });
    },
    addMatch: async (
      _: any,
      {
        homeTeamId,
        awayTeamId,
        homeScore,
        awayScore,
      }: {
        homeTeamId: number;
        awayTeamId: number;
        homeScore: number;
        awayScore: number;
      }
    ) => {
      const match = await prisma.match.create({
        data: {
          homeTeamId,
          awayTeamId,
          homeScore,
          awayScore,
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
  },
};

export default resolvers;
