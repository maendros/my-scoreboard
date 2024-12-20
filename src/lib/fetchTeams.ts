import { teamCache } from "./teamCache";

interface FootballTeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  venue: string;
  clubColors: string;
}

const COMPETITIONS = [
  "WC", // FIFA World Cup
  "CL", // UEFA Champions League
  "BL1", // Bundesliga (Germany)
  "DED", // Eredivisie (Netherlands)
  "BSA", // Série A (Brazil)
  "PD", // Primera División / La Liga (Spain)
  "FL1", // Ligue 1 (France)
  "ELC", // Championship (England)
  "PPL", // Primeira Liga (Portugal)
  //"EC", // European Championship
  "SA", // Serie A (Italy)
  "PL", // Premier League (England)
  //"CLI", // Copa Libertadores
];

export const prefetchTeams = async (): Promise<FootballTeam[]> => {
  console.log("Starting prefetchTeams...");
  const cachedData = await teamCache.get<FootballTeam[]>("teams");

  if (cachedData) {
    console.log("Cache hit! Teams found:", cachedData.length);
    return cachedData;
  }

  console.log("Cache miss, fetching teams from API...");
  const allTeams: FootballTeam[] = [];

  for (const competition of COMPETITIONS) {
    console.log(`Fetching teams for competition ${competition}...`);
    const response = await fetch(
      `http://api.football-data.org/v4/competitions/${competition}/teams`,
      {
        headers: {
          "X-Auth-Token": process.env.FOOTBALL_API_KEY || "",
        },
      }
    );
    const data = await response.json();
    //console.log("API Response:", JSON.stringify(data, null, 2));
    console.log("API Response:", data.teams[0]?.name);
    if (data.teams?.length > 0) {
      const simplifiedTeams = data.teams.map((team: any) => ({
        id: team.id,
        name: team.name,
        shortName: team.shortName,
        tla: team.tla,
        crest: team.crest,
        venue: team.venue,
        clubColors: team.clubColors,
      }));
      allTeams.push(...simplifiedTeams);
      console.log(
        `Added ${simplifiedTeams.length} teams from competition ${competition}`
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 4000));
  }

  const uniqueTeams = Array.from(
    new Map(allTeams.map((team) => [team.id, team])).values()
  );
  console.log(`Setting cache with ${uniqueTeams.length} teams`);
  teamCache.set("teams", uniqueTeams);
  console.log("Cache keys after set:", teamCache.keys());
  return uniqueTeams;
};
