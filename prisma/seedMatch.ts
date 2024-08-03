import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Define the match data
    const matches = [
      {
        homeTeamId: 1,
        awayTeamId: 3,
        homeScore: 1,
        awayScore: 3,
        playedAt: new Date("2024-08-03T14:37:18.337Z"),
        userTeams: [
          {
            userId: 1,
            teamId: 1,
            isWinner: false,
          },
          {
            userId: 3,
            teamId: 2,
            isWinner: true,
          },
        ],
      },
    ];

    // Check if teams exist in the database
    const existingTeams = await prisma.team.findMany();
    console.log("Existing Teams in DB:", existingTeams);

    // Mapping userTeams to check if teamId exists in the database
    for (const match of matches) {
      for (const userTeam of match.userTeams) {
        const teamExists = existingTeams.some(
          (team) => team.id === userTeam.teamId
        );
        if (!teamExists) {
          console.error(
            `Team with ID ${userTeam.teamId} does not exist in the database.`
          );
          return;
        }
      }
    }

    // Iterate through matches and create them in the database
    for (const match of matches) {
      const createdMatch = await prisma.match.create({
        data: {
          homeTeamId: match.homeTeamId,
          awayTeamId: match.awayTeamId,
          homeScore: match.homeScore,
          awayScore: match.awayScore,
          playedAt: match.playedAt,
          userTeams: {
            create: match.userTeams.map((userTeam) => ({
              userId: userTeam.userId,
              teamId: userTeam.teamId,
              isWinner: userTeam.isWinner,
            })),
          },
        },
      });
      console.log("Match created:", createdMatch);
    }
  } catch (error) {
    console.error("Error adding matches:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
