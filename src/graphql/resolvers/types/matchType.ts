import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const matchTypeResolvers = {
  Match: {
    homeTeam: (parent: any) =>
      prisma.team.findUnique({ where: { id: parent.homeTeamId } }),
    awayTeam: (parent: any) =>
      prisma.team.findUnique({ where: { id: parent.awayTeamId } }),
    playedAt: (parent: any) => new Date(parent.playedAt).toISOString(),
  },
};

export default matchTypeResolvers;
