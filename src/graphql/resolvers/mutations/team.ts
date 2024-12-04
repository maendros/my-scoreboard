import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const teamMutationResolvers = {
  Mutation: {
    addTeam: async (_: any, { team }: { team: any }) => {
      try {
        return await prisma.team.create({
          data: {
            name: team.name,
            profile: team.profile || {},
          },
        });
      } catch (error) {
        console.error("Error adding team:", error);
        throw new Error("Failed to add team");
      }
    },

    updateTeam: async (_: any, { id, team }: { id: number; team: any }) => {
      try {
        return await prisma.team.update({
          where: { id },
          data: {
            name: team.name,
            profile: team.profile || {},
          },
        });
      } catch (error) {
        console.error("Error updating team:", error);
        throw new Error("Failed to update team");
      }
    },

    deleteTeam: async (_: any, { id }: { id: number }) => {
      try {
        await prisma.team.delete({ where: { id } });
        return true;
      } catch (error) {
        console.error("Error deleting team:", error);
        throw new Error("Failed to delete team");
      }
    },
  },
};

export default teamMutationResolvers;
