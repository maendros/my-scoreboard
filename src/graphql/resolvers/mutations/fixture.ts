import { PrismaClient } from "@prisma/client";
import { pubsub, FIXTURE_ADDED } from "@/graphql/pubsub";

const prisma = new PrismaClient();

const fixtureMutationResolvers = {
  Mutation: {
    addFixtures: async (_: any, { fixtures }: { fixtures: any[] }) => {
      try {
        const createdFixtures = await Promise.all(
          fixtures.map(async (fixture) => {
            return prisma.fixture.create({
              data: {
                leagueId: fixture.leagueId,
                homeTeamId: fixture.homeTeamId,
                awayTeamId: fixture.awayTeamId,
                homeScore: fixture.homeScore,
                awayScore: fixture.awayScore,
                playedAt: new Date(fixture.playedAt),
                homeTeamDetails: fixture.homeTeamDetails || {}, // Optional details
                awayTeamDetails: fixture.awayTeamDetails || {},
              },
              include: {
                league: true,
                homeTeam: true,
                awayTeam: true,
              },
            });
          })
        );
        return createdFixtures;
      } catch (error) {
        console.error("Error adding fixtures:", error);
        throw new Error("Failed to add fixtures");
      }
    },

    updateFixture: async (
      _: any,
      { id, fixture }: { id: number; fixture: any }
    ) => {
      try {
        const updatedFixture = await prisma.fixture.update({
          where: { id },
          data: {
            leagueId: fixture.leagueId || null,
            homeTeamId: fixture.homeTeamId,
            awayTeamId: fixture.awayTeamId,
            homeScore: fixture.homeScore,
            awayScore: fixture.awayScore,
            playedAt: new Date(fixture.playedAt),
            homeTeamDetails: fixture.homeTeamDetails || {}, // Optional details
            awayTeamDetails: fixture.awayTeamDetails || {},
          },
          include: {
            league: true,
            homeTeam: true,
            awayTeam: true,
          },
        });

        return updatedFixture;
      } catch (error) {
        console.error("Error updating fixture:", error);
        throw new Error("Failed to update fixture");
      }
    },

    deleteFixture: async (_: any, { id }: { id: number }) => {
      try {
        await prisma.fixture.delete({ where: { id } });
        return true;
      } catch (error) {
        console.error("Error deleting fixture:", error);
        throw new Error("Failed to delete fixture");
      }
    },
  },
};

export default fixtureMutationResolvers;
