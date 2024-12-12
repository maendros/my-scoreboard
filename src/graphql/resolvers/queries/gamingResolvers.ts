import { teamCache } from "@/app/api/fetch-gaming-teams/route";

// Initialize cache

// List of competitions to fetch teams from

interface FootballTeam {
  id: number;
  name: string;
}

const gamingResolvers = {
  Query: {
    gamingTeams: async () => {
      const cachedTeams = teamCache.get<FootballTeam[]>("allTeams");

      if (!cachedTeams) {
        const test = [
          {
            id: 788,
            name: "Switzerland",
          },
          {
            id: 833,
            name: "Wales",
          },
          {
            id: 11,
            name: "VfL Wolfsburg",
          },
          {
            id: 12,
            name: "SV Werder Bremen",
          },
          {
            id: 666,
            name: "FC Twente '65",
          },
          {
            id: 672,
            name: "Willem II Tilburg",
          },
          {
            id: 683,
            name: "RKC Waalwijk",
          },
          {
            id: 684,
            name: "PEC Zwolle",
          },
          {
            id: 68,
            name: "Norwich City FC",
          },
          {
            id: 72,
            name: "Swansea City AFC",
          },
          {
            id: 74,
            name: "West Bromwich Albion FC",
          },
          {
            id: 345,
            name: "Sheffield Wednesday FC",
          },
          {
            id: 346,
            name: "Watford FC",
          },
          {
            id: 384,
            name: "Millwall FC",
          },
          {
            id: 389,
            name: "Luton Town FC",
          },
          {
            id: 67,
            name: "Newcastle United FC",
          },
          {
            id: 76,
            name: "Wolverhampton Wanderers FC",
          },
          {
            id: 349,
            name: "Ipswich Town FC",
          },
          {
            id: 563,
            name: "West Ham United FC",
          },
          {
            id: 7865,
            name: "Club Always Ready",
          },
        ];
        return test;
        // throw new Error("Teams not found in cache. Trigger a fetch first.");
      }
      return cachedTeams;
    },
    possibleFormations: () => {
      return [
        "4-4-2",
        "4-3-3",
        "3-5-2",
        "3-4-3",
        "5-3-2",
        "5-4-1",
        "4-2-3-1",
        "4-1-4-1",
        "4-5-1",
        "3-3-4",
      ];
    },
  },
};

export default gamingResolvers;
