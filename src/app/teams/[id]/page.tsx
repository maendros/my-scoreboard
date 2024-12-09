"use client";

import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import LeagueSelector from "@/components/LeagueSelector";
import TeamStatsChart from "@/components/TeamStatsChart";
import HeadToHeadStats from "@/components/HeadToHeadStats";
import { useParams } from "next/navigation";
import client from "@/lib/apolloClient";
import "@/lib/chartSetup";
import Loader from "@/components/Loader";

const TEAM_DETAILS_QUERY = gql`
  query TeamDetails($id: Int!) {
    teamDetails(id: $id) {
      id
      name
      profile
      leagues {
        id
        name
      }
    }
    leagueStats(teamId: $id) {
      wins
      draws
      losses
    }
  }
`;

const LEAGUE_STATS_QUERY = gql`
  query LeagueStats($teamId: Int!, $leagueId: Int!) {
    leagueStats(teamId: $teamId, leagueId: $leagueId) {
      wins
      draws
      losses
    }
    league(id: $leagueId) {
      id
      name
      teams {
        id
        name
      }
    }
  }
`;


const TeamProfilePage = () => {
  const params = useParams();
  const teamId = parseInt(params.id as string, 10);

  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);
  const [leagueStats, setLeagueStats] = useState<{
    wins: number;
    draws: number;
    losses: number;
  } | null>(null);
  const [teams, setTeams] = useState<{id:number; name: string}[] >([])


  const { data, loading, error } = useQuery(TEAM_DETAILS_QUERY, {
    variables: { id: teamId },
    skip: !teamId,
  });

  const handleLeagueChange = async (leagueId: number | null) => {
    setSelectedLeagueId(leagueId);
    const { data: statsData } = await client.query({
      query: LEAGUE_STATS_QUERY,
      variables: { teamId, leagueId }, // Include league
    });
    setTeams(statsData.league.teams)
    
    
    setLeagueStats(statsData.leagueStats);
  };


  if (loading) return  <Loader/>;
  if (error) return <div>Error loading team details</div>;

  const team = data?.teamDetails;
  const overallStats= data?.leagueStats

  return (
    
    <div className="min-h-screen dark:bg-gray-900 bg-white  p-6 dark:text-white text-gray-800">
      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: team.profile.color }}
      >
        {team.name}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Stats */}
        <div className="dark:bg-gray-800 bg-gray-300 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold mb-4 ">Overall Stats</h2>
          </div>
          <div className="w-full md:w-2/3">
            <TeamStatsChart
              stats={
                overallStats as { wins: number; draws: number; losses: number }
              }
            />
          </div>
        </div>

        {/* Stats by League */}
        <div className="dark:bg-gray-800 bg-gray-300  rounded-lg p-6 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0 w-full md:w-1/3">
            <h2 className="text-xl font-bold mb-4">
              Stats by League
            </h2>
            <LeagueSelector
              leagues={team.leagues}
              selectedLeagueId={selectedLeagueId}
              onLeagueSelect={handleLeagueChange}
            />
          </div>
          <div className="w-full md:w-2/3">
            <TeamStatsChart
              stats={
                leagueStats as { wins: number; draws: number; losses: number }
              }
            />
          </div>
        </div>

        {/* Head-to-Head Stats */}

          <HeadToHeadStats
            teamId={teamId}
            teams={teams}
            selectedLeagueId={selectedLeagueId}
          />
       
      </div>
    </div>
  );
};

export default TeamProfilePage;
