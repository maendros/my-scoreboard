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
  const teams = (await teamCache.get("teams")) as FootballTeam[];
  const cacheKeys = await teamCache.keys();

  return NextResponse.json({
    cacheExists: !!teams,
    teamsCount: teams ? teams.length : 0,
    timestamp: new Date().toISOString(),
    cacheKeys: cacheKeys,
    teams: teams || [],
  });
}
