import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const leagueResolvers = {
  Mutation: {
    addLeague: async (_: any, { league }: { league: any }) => {
      try {

        const { name, profile, isGamingLeague, size } = league;
        return await prisma.league.create({
          data: {
            name,
            profile,
            isGamingLeague,
            size, // Save the league size
          },
        });
      } catch (error) {
        console.error("Error creating league:", error);
        throw new Error("Failed to create league");
      }
    },

    updateLeague: async (
      _: any,
      { id, league }: { id: number; league: any }
    ) => {
      try {
      
        return await prisma.league.update({
          where: { id },
          data: {
            name: league.name,
            profile: league.profile || {},
            isGamingLeague: league.isGamingLeague,
            size: league.size,
          },
        });
      } catch (error) {
        console.error("Error updating league:", error);
        throw new Error("Failed to update league");
      }
    },

    deleteLeague: async (_: any, { id }: { id: number }) => {
      try {
        await prisma.league.delete({ where: { id } });
        return true;
      } catch (error) {
        console.error("Error deleting league:", error);
        throw new Error("Failed to delete league");
      }
    },

    addTeamsToLeague: async (
      _: any,
      { leagueId, teamIds }: { leagueId: number; teamIds: number[] }
    ) => {
      try {
        // Fetch the league with its size and current teams
        const league = await prisma.league.findUnique({
          where: { id: leagueId },
          include: { teams: true }, // Include current teams
        });

        if (!league) {
          throw new Error("League not found");
        }

        // Check if adding the teams will exceed the league size
        const currentTeamCount = league.teams.length;
        const newTeamCount = currentTeamCount + teamIds.length;

        if (newTeamCount > league.size) {
          throw new Error(
            `Adding these teams would exceed the league size of ${league.size}.`
          );
        }

        // Create the new league-team relationships
        const operations = teamIds.map((teamId) =>
          prisma.leagueTeam.create({
            data: {
              leagueId,
              teamId,
            },
          })
        );

        await Promise.all(operations);

        // Return the updated league with teams
        return await prisma.league.findUnique({
          where: { id: leagueId },
          include: { teams: { include: { team: true } } },
        });
      } catch (error) {
        console.error("Error adding teams to league:", error);
        throw new Error("Failed to add teams to league");
      }
    },

    removeTeamFromLeague: async (
      _: any,
      { leagueId, teamId }: { leagueId: number; teamId: number }
    ) => {
      try {
        const leagueTeam = await prisma.leagueTeam.findFirst({
          where: {
            leagueId,
            teamId,
          },
        });

        if (!leagueTeam) {
          throw new Error("Team is not part of the league.");
        }

        await prisma.leagueTeam.delete({
          where: {
            id: leagueTeam.id,
          },
        });

        // Optionally, fetch and return the updated league
        return await prisma.league.findUnique({
          where: { id: leagueId },
          include: { teams: { include: { team: true } } },
        });
      } catch (error) {
        console.error("Error removing team from league:", error);
        throw new Error("Failed to remove team from league. backend");
      }
    },
  },
};

export default leagueResolvers;
