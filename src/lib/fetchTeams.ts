import { teamCache } from "./teamCache";

interface FootballTeam {
  id: number;
  name: string;
}

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

export const prefetchTeams = async (): Promise<FootballTeam[]> => {
  const cachedData = teamCache.get<FootballTeam[]>("teams");
  if (!cachedData) {
    const allTeams: FootballTeam[] = [];
    for (const competition of COMPETITIONS) {
      const response = await fetch(
        `http://api.football-data.org/v4/competitions/${competition}/teams`,
        {
          headers: {
            "X-Auth-Token": process.env.FOOTBALL_API_KEY || "",
          },
        }
      );
      const data = await response.json();
      if (data.teams) {
        allTeams.push(...data.teams);
      }
      await new Promise((resolve) => setTimeout(resolve, 6000));
    }
    const uniqueTeams = Array.from(
      new Map(allTeams.map((team) => [team.id, team])).values()
    );
    teamCache.set("teams", uniqueTeams);
    return uniqueTeams;
  }
  return cachedData;
};
