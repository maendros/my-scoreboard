// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
//   try {
//     // Define the match data
//     const matches = [
//       {
//         homeTeamId: 1,
//         awayTeamId: 3,
//         homeScore: 1,
//         awayScore: 3,
//         playedAt: new Date("2024-08-03T14:37:18.337Z"),
//       },
//       // Add more match objects here as needed
//     ];

//     // Iterate through matches and create them in the database
//     for (const match of matches) {
//       const createdMatch = await prisma.match.create({
//         data: {
//           homeTeamId: match.homeTeamId,
//           awayTeamId: match.awayTeamId,
//           homeScore: match.homeScore,
//           awayScore: match.awayScore,
//           playedAt: match.playedAt,
//           // No need to include userTeams if not required
//         },
//       });
//       console.log("Match created:", createdMatch);
//     }
//   } catch (error) {
//     console.error("Error adding matches:", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// main();
