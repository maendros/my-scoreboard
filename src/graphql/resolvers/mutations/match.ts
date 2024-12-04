import { PrismaClient } from "@prisma/client";
import { pubsub, MATCH_ADDED } from "@/graphql/pubsub";

const prisma = new PrismaClient();

const matchMutationResolvers = {
  Mutation: {
    addMatch: async (_: any, { match }: { match: any }) => {
      try {
        const createdMatch = await prisma.match.create({
          data: {
            leagueId: match.leagueId || null, // Nullable league association
            homeTeamId: match.homeTeamId,
            awayTeamId: match.awayTeamId,
            homeScore: match.homeScore,
            awayScore: match.awayScore,
            playedAt: new Date(match.playedAt),
          },
          include: {
            league: true,
            homeTeam: true,
            awayTeam: true,
          },
        });

        pubsub.publish(MATCH_ADDED, { matchAdded: createdMatch });
        return createdMatch;
      } catch (error) {
        console.error("Error adding match:", error);
        throw new Error("Failed to add match");
      }
    },

    updateMatch: async (_: any, { id, match }: { id: number; match: any }) => {
      try {
        const updatedMatch = await prisma.match.update({
          where: { id },
          data: {
            leagueId: match.leagueId || null,
            homeTeamId: match.homeTeamId,
            awayTeamId: match.awayTeamId,
            homeScore: match.homeScore,
            awayScore: match.awayScore,
            playedAt: new Date(match.playedAt),
          },
          include: {
            league: true,
            homeTeam: true,
            awayTeam: true,
          },
        });

        return updatedMatch;
      } catch (error) {
        console.error("Error updating match:", error);
        throw new Error("Failed to update match");
      }
    },

    deleteMatch: async (_: any, { id }: { id: number }) => {
      try {
        await prisma.match.delete({ where: { id } });
        return true;
      } catch (error) {
        console.error("Error deleting match:", error);
        throw new Error("Failed to delete match");
      }
    },
  },
};

export default matchMutationResolvers;
