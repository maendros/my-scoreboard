import { NextResponse } from "next/server";
import fetch from "node-fetch";
import NodeCache from "node-cache";

export const teamCache = new NodeCache({ stdTTL: 90 * 24 * 60 * 60 }); // 90 days in seconds

const COMPETITIONS = [
  "WC",
  "CL",
  "BL1",
  "DED",
  "BSA",
  "PD",
  "FL1",
  "ELC",
  "PPL",
  "EC",
  "SA",
  "PL",
  "CLI",
];

interface FootballTeam {
  id: number;
  name: string;
}

interface FootballCompetitionResponse {
  teams: FootballTeam[];
}

const fetchTeamsByCompetition = async (
  competitionCode: string
): Promise<FootballTeam[]> => {
  const url = `https://api.football-data.org/v4/competitions/${competitionCode}/teams`;
  const response = await fetch(url, {
    headers: {
      "X-Auth-Token": process.env.FOOTBALL_API_KEY!,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch teams for competition: ${competitionCode}`
    );
  }

  const data = (await response.json()) as FootballCompetitionResponse;
  return data.teams;
};

export async function GET() {
  try {
    const cachedTeams = teamCache.get<FootballTeam[]>("allTeams");

    if (cachedTeams) {
      return NextResponse.json({ success: true, teams: cachedTeams });
    }

    const allTeams: FootballTeam[] = [];
    for (const competition of COMPETITIONS) {
      const teams = await fetchTeamsByCompetition(competition);
      allTeams.push(...teams);

      // Respect rate limit
      await new Promise((resolve) => setTimeout(resolve, 6000));
    }

    // Deduplicate teams
    const uniqueTeams = Array.from(
      new Map(allTeams.map((team) => [team.id, team])).values()
    );

    teamCache.set("allTeams", uniqueTeams);

    return NextResponse.json({ success: true, teams: uniqueTeams });
  } catch (error: any) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
