import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";

const prisma = new PrismaClient();
const pubsub = new PubSub();
const MATCH_ADDED = "MATCH_ADDED";

const matchMutationResolvers = {
  Mutation: {
    addMatches: async (_: any, { matches }: { matches: any[] }) => {
      try {
        const createdMatches = await Promise.all(
          matches.map(async (match) => {
            return await prisma.match.create({
              data: {
                homeTeamId: parseInt(match.homeTeamId, 10),
                awayTeamId: parseInt(match.awayTeamId, 10),
                homeScore: match.homeScore,
                awayScore: match.awayScore,
                playedAt: new Date(match.playedAt),
                userTeams: match.userTeams
                  ? {
                      create: match.userTeams.map((userTeam: any) => ({
                        userId: parseInt(userTeam.userId, 10),
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
};

export default matchMutationResolvers;
