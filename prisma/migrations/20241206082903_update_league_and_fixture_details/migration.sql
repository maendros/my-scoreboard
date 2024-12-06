-- AlterTable
ALTER TABLE "Fixture" ADD COLUMN     "awayTeamDetails" JSONB,
ADD COLUMN     "homeTeamDetails" JSONB;

-- AlterTable
ALTER TABLE "League" ADD COLUMN     "isGamingLeague" BOOLEAN DEFAULT false,
ADD COLUMN     "size" INTEGER NOT NULL DEFAULT 4;
