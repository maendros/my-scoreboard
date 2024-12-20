import { teamCache } from "@/lib/teamCache";

// Initialize cache

// List of competitions to fetch teams from

interface FootballTeam {
  id: number;
  name: string;
}

const gamingResolvers = {
  Query: {
    gamingTeams: async () => {
      const cachedTeams = teamCache.get<FootballTeam[]>("teams");

      if (!cachedTeams) {
        // const test = [
        //   {
        //     id: 788,
        //     name: "Switzerland",
        //   },
        //   {
        //     id: 833,
        //     name: "Wales",
        //   },
        //   {
        //     id: 11,
        //     name: "VfL Wolfsburg",
        //   },
        //   {
        //     id: 12,
        //     name: "SV Werder Bremen",
        //   },
        //   {
        //     id: 666,
        //     name: "FC Twente '65",
        //   },
        //   {
        //     id: 672,
        //     name: "Willem II Tilburg",
        //   },
        //   {
        //     id: 683,
        //     name: "RKC Waalwijk",
        //   },
        //   {
        //     id: 684,
        //     name: "PEC Zwolle",
        //   },
        //   {
        //     id: 68,
        //     name: "Norwich City FC",
        //   },
        //   {
        //     id: 72,
        //     name: "Swansea City AFC",
        //   },
        //   {
        //     id: 74,
        //     name: "West Bromwich Albion FC",
        //   },
        //   {
        //     id: 345,
        //     name: "Sheffield Wednesday FC",
        //   },
        //   {
        //     id: 346,
        //     name: "Watford FC",
        //   },
        //   {
        //     id: 384,
        //     name: "Millwall FC",
        //   },
        //   {
        //     id: 389,
        //     name: "Luton Town FC",
        //   },
        //   {
        //     id: 67,
        //     name: "Newcastle United FC",
        //   },
        //   {
        //     id: 76,
        //     name: "Wolverhampton Wanderers FC",
        //   },
        //   {
        //     id: 349,
        //     name: "Ipswich Town FC",
        //   },
        //   {
        //     id: 563,
        //     name: "West Ham United FC",
        //   },
        //   {
        //     id: 7865,
        //     name: "Club Always Ready",
        //   },
        // ];
        throw new Error("Teams not found in cache. Trigger a fetch first.");
        //    return test;
        // throw new Error("Teams not found in cache. Trigger a fetch first.");
      }
      return cachedTeams;
    },
  },
};

export default gamingResolvers;
