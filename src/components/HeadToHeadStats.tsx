"use client";

import { useState } from "react";
import { gql, useQuery } from "@apollo/client";

const TEAM_VS_TEAM_STATS_QUERY = gql`
  query TeamVsTeamStats($team1Id: Int!, $team2Id: Int!, $leagueId: Int) {
    teamVsTeamStats(team1Id: $team1Id, team2Id: $team2Id, leagueId: $leagueId) {
      team1Wins
      team2Wins
      draws
    }
  }
`;

type HeadToHeadStatsProps = {
  teamId: number;
  selectedLeagueId: number | null;
};

const HeadToHeadStats: React.FC<HeadToHeadStatsProps> = ({
  teamId,
  selectedLeagueId,
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
    skip: !selectedOpponentId,
  });

  return (
    <div className="p-4 bg-gray-800 shadow-md rounded-md">
      <h3 className="text-lg font-semibold mb-4">Head-to-Head Stats</h3>
      <select
        className="w-full p-2 border border-gray-700 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        onChange={(e) => setSelectedOpponentId(Number(e.target.value))}
      >
        <option value="">Select Opponent</option>
        {/* Populate dynamically */}
      </select>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error loading stats</p>}
      {data?.teamVsTeamStats && (
        <div>
          <p>Wins: {data.teamVsTeamStats.team1Wins}</p>
          <p>Losses: {data.teamVsTeamStats.team2Wins}</p>
          <p>Draws: {data.teamVsTeamStats.draws}</p>
        </div>
      )}
    </div>
  );
};

export default HeadToHeadStats;
