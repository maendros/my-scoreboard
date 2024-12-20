import { Context } from "@/types/context";

const userQueryResolvers = {
  Query: {
    myTeams: async (
      _: any,
      { userId }: { userId: number },
      context: Context
    ) => {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const teams = await context.prisma.team.findMany({
        where: {
          userId,
        },
        include: {
          user: true,
        },
      });
      return teams;
    },

    teams: async (_: any, __: any, context: Context) => {
      if (context.user?.role === "ADMIN") {
        return context.prisma.team.findMany({
          include: {
            user: true,
          },
        });
      }

      return context.prisma.team.findMany({
        where: {
          userId: context.user?.id,
        },
      });
    },
  },
};

export default userQueryResolvers;
