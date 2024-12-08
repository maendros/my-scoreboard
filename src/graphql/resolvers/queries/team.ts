import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const teamQueryResolvers = {
  Query: {
    // Fetch all teams
    teams: async () => {
      try {
        return await prisma.team.findMany();
      } catch (error) {
        console.error("Error fetching teams:", error);
        return [];
      }
    },

    // Fetch team details
    teamDetails: async (_: any, { id }: { id: number }) => {
      try {
        const team = await prisma.team.findUnique({
          where: { id },
          include: {
            leagues: {
              include: {
                league: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        });

        if (!team) {
          throw new Error("Team not found");
        }

        const leaguesWithNames = team.leagues.map((leagueTeam) => ({
          ...leagueTeam,
          id: leagueTeam.leagueId,
          name: leagueTeam.league?.name || "", // FIXIT  name String @db.VarChar(255)
        }));
        console.log(leaguesWithNames);

        return { ...team, leagues: leaguesWithNames };
      } catch (error) {
        console.error("Error fetching team details:", error);
        throw new Error("Unable to fetch team details");
      }
    },

    leagueStats: async (
      _: any,
      { teamId, leagueId }: { teamId: number; leagueId?: number }
    ) => {
      try {
        const fixtures = await prisma.fixture.findMany({
          where: {
            ...(leagueId ? { leagueId } : {}), // Include leagueId only if it's provided
            OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
          },
        });

        const stats = fixtures.reduce(
          (acc, fixture) => {
            const isHome = fixture.homeTeamId === teamId;
            const scored = isHome ? fixture.homeScore : fixture.awayScore;
            const conceded = isHome ? fixture.awayScore : fixture.homeScore;

            if (scored > conceded) acc.wins += 1;
            else if (scored < conceded) acc.losses += 1;
            else acc.draws += 1;

            return acc;
          },
          { wins: 0, losses: 0, draws: 0 }
        );

        return stats;
      } catch (error) {
        console.error("Error fetching league stats:", error);
        throw new Error("Unable to fetch league stats");
      }
    },

    // Stats between two teams
    teamVsTeamStats: async (
      _: any,
      {
        team1Id,
        team2Id,
        leagueId,
      }: { team1Id: number; team2Id: number; leagueId?: number }
    ) => {
      try {
        const fixtures = await prisma.fixture.findMany({
          where: {
            OR: [
              { homeTeamId: team1Id, awayTeamId: team2Id },
              { homeTeamId: team2Id, awayTeamId: team1Id },
            ],
            ...(leagueId && { leagueId }),
          },
        });

        const stats = fixtures.reduce(
          (acc, fixture) => {
            const isTeam1Home = fixture.homeTeamId === team1Id;
            const team1Scored = isTeam1Home
              ? fixture.homeScore
              : fixture.awayScore;
            const team2Scored = isTeam1Home
              ? fixture.awayScore
              : fixture.homeScore;

            if (team1Scored > team2Scored) acc.team1Wins += 1;
            else if (team1Scored < team2Scored) acc.team2Wins += 1;
            else acc.draws += 1;

            return acc;
          },
          { team1Wins: 0, team2Wins: 0, draws: 0 }
        );

        return stats;
      } catch (error) {
        console.error("Error fetching team-vs-team stats:", error);
        throw new Error("Unable to fetch stats between the teams");
      }
    },
  },
};

export default teamQueryResolvers;
