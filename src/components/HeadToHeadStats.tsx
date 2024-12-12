"use client";

import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import TeamStatsChart from "./TeamStatsChart";
import Loader from "./Loader";

const TEAM_VS_TEAM_STATS_QUERY = gql`
  query TeamVsTeamStats($team1Id: Int!, $team2Id: Int!, $leagueId: Int) {
    teamVsTeamStats(team1Id: $team1Id, team2Id: $team2Id, leagueId: $leagueId) {
      team1Wins
      team2Wins
      draws
    }
  }
`;

type Team = {
  id: number;
  name: string;
};

type HeadToHeadStatsProps = {
  teamId: number;
  selectedLeagueId: number | null;
  teams: Team[]; // Array of teams
};

const HeadToHeadStats: React.FC<HeadToHeadStatsProps> = ({
  teamId,
  selectedLeagueId,
  teams,
}) => {
  const [selectedOpponentId, setSelectedOpponentId] = useState<number | null>(
    null
  );

  const { data, loading, error } = useQuery(TEAM_VS_TEAM_STATS_QUERY, {
    variables: {
      team1Id: teamId,
      team2Id: selectedOpponentId,
      leagueId: selectedLeagueId,
    },
    skip: !selectedOpponentId, // Skip query if no opponent is selected
  });

  return (
    <>
      <div className="mb-4 md:mb-0 w-full md:w-1/3">
        <h2 className="text-xl font-bold mb-4">Head-to-Head Stats</h2>
        <select
          className="w-2/3 p-2 border border-gray-700 dark:bg-gray-800 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          onChange={(e) => setSelectedOpponentId(Number(e.target.value))}
        >
          <option value="">Select Opponent</option>
          {teams
            .filter((team) => team.id !== teamId) // Exclude current team
            .map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
        </select>
      </div>

      {loading && <Loader />}
      {error && <p className="text-red-500">Error loading stats</p>}
      {data?.teamVsTeamStats && (
        <div className="w-full md:w-2/3">
          <TeamStatsChart
            stats={{
              wins: data.teamVsTeamStats.team1Wins,
              losses: data.teamVsTeamStats.team2Wins,
              draws: data.teamVsTeamStats.draws,
            }}
            chartType="bar" // Add this prop
          />
        </div>
      )}
    </>
  );
};

export default HeadToHeadStats;
