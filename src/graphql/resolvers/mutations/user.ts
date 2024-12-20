import { Context } from "@/types/context";

const userMutationResolvers = {
  Mutation: {
    updateTeam: async (
      _: any,
      { id, team }: { id: number; team: { name: string; profile: any } },
      context: Context
    ) => {
      console.log({ id, team });
      return context.prisma.team.update({
        where: { id },
        data: {
          name: team.name,
          profile: team.profile,
        },
      });
    },

    assignTeam: async (
      _: any,
      { teamId, userId }: { teamId: number; userId: number },
      context: Context
    ) => {
      return context.prisma.team.update({
        where: { id: teamId },
        data: { userId },
        include: { user: true },
      });
    },
  },
};

export default userMutationResolvers;
