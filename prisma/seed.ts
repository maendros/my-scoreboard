import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const users = [
  { name: "Panos", email: "panos@example.com" },
  { name: "Spyros", email: "spyros@example.com" },
  { name: "Stelios", email: "stelios@example.com" },
  { name: "Paschos", email: "paschos@example.com" },
  { name: "Mike", email: "mike@example.com" },
];

const matches = [
  { homeTeam: "Panos", awayTeam: "Stelios", homeScore: 1, awayScore: 0 },
  { homeTeam: "Stelios", awayTeam: "Spyros", homeScore: 2, awayScore: 0 },
  { homeTeam: "Mike", awayTeam: "Paschos", homeScore: 2, awayScore: 2 },
];

async function main() {
  const userIds: { [name: string]: number } = {};

  for (const user of users) {
    const result = await prisma.user.create({
      data: { name: user.name, email: user.email },
    });
    userIds[user.name] = result.id;
  }

  for (const match of matches) {
    await prisma.match.create({
      data: {
        homeTeamId: userIds[match.homeTeam],
        awayTeamId: userIds[match.awayTeam],
        homeScore: match.homeScore,
        awayScore: match.awayScore,
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
