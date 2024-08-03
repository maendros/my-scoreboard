import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const users = [
  { name: "Panos", email: "panos@example.com" },
  { name: "Spyros", email: "spyros@example.com" },
  { name: "Stelios", email: "stelios@example.com" },
  { name: "Paschos", email: "paschos@example.com" },
  { name: "Mike", email: "mike@example.com" },
];

const teams = [{ name: "Team A" }, { name: "Team B" }];

const matches = [
  {
    homeTeam: "Panos",
    awayTeam: "Stelios",
    homeScore: 1,
    awayScore: 0,
    playedAt: new Date("2024-07-29 04:06:24.526"),
    userTeams: [
      { userId: 1, teamId: 1, isWinner: true }, // Panos with Team A
    ],
  },
  {
    homeTeam: "Stelios",
    awayTeam: "Spyros",
    homeScore: 2,
    awayScore: 0,
    playedAt: new Date("2024-07-30 04:06:24.526"),
    userTeams: [
      { userId: 3, teamId: 2, isWinner: true }, // Stelios with Team B
    ],
  },
  {
    homeTeam: "Mike",
    awayTeam: "Paschos",
    homeScore: 2,
    awayScore: 2,
    playedAt: new Date("2024-07-31 04:06:24.526"),
    userTeams: [
      { userId: 5, teamId: 1, isWinner: false }, // Mike with Team A
    ],
  },
];

async function main() {
  // Seed users
  const userIds: { [name: string]: number } = {};
  for (const user of users) {
    const result = await prisma.user.create({
      data: { name: user.name, email: user.email },
    });
    userIds[user.name] = result.id;
  }

  // Seed teams
  const teamIds: { [name: string]: number } = {};
  for (const team of teams) {
    const result = await prisma.team.create({
      data: { name: team.name },
    });
    teamIds[team.name] = result.id;
  }

  // Seed matches
  for (const match of matches) {
    await prisma.match.create({
      data: {
        homeTeamId: userIds[match.homeTeam],
        awayTeamId: userIds[match.awayTeam],
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        playedAt: match.playedAt,
        userTeams: {
          create: match.userTeams.map((ut) => ({
            userId: ut.userId,
            teamId: ut.teamId,
            isWinner: ut.isWinner,
          })),
        },
      },
    });
  }

  console.log("Data seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
