import { teamCache } from "@/lib/teamCache";
import { NextResponse } from "next/server";

interface FootballTeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  venue: string;
  clubColors: string;
}

export async function GET() {
  console.log("Cache keys available:", Array.from(teamCache.keys()));
  console.log("Attempting to get teams with key 'teams'");

  const teams = teamCache.get("teams") as FootballTeam[];
  console.log("Cache content:", JSON.stringify(teams, null, 2));

  return NextResponse.json({
    cacheExists: !!teams,
    teamsCount: teams ? teams.length : 0,
    timestamp: new Date().toISOString(),
    cacheKeys: Array.from(teamCache.keys()),
    teams: teams || [],
  });
}
