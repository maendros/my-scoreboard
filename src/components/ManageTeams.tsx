"use client";

import React, { useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { toast } from "react-toastify";
import MultiSelect from "./MultiSelect";
import LeagueTeams from "./LeagueTeams";

// GraphQL Queries and Mutations
const GET_TEAMS_QUERY = gql`
  query GetTeams {
    teams {
      id
      name
    }
  }
`;

const GET_LEAGUE_TEAMS_QUERY = gql`
  query GetLeagueTeams($leagueId: Int!) {
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

const ADD_TEAMS_TO_LEAGUE_MUTATION = gql`
  mutation AddTeamsToLeague($leagueId: Int!, $teamIds: [Int!]!) {
    addTeamsToLeague(leagueId: $leagueId, teamIds: $teamIds) {
      id
      teams {
        id
        name
      }
    }
  }
`;

const REMOVE_TEAM_FROM_LEAGUE_MUTATION = gql`
  mutation RemoveTeamFromLeague($leagueId: Int!, $teamId: Int!) {
    removeTeamFromLeague(leagueId: $leagueId, teamId: $teamId) {
      id
      teams {
        id
        name
      }
    }
  }
`;


const ManageTeams: React.FC<{ leagueId: number }> = ({ leagueId }) => {
  const { loading: loadingTeams, error: errorTeams, data: dataTeams } = useQuery(GET_TEAMS_QUERY);
  const {
    loading: loadingLeagueTeams,
    error: errorLeagueTeams,
    data: dataLeagueTeams,
    refetch: refetchLeagueTeams,
  } = useQuery(GET_LEAGUE_TEAMS_QUERY, {
    variables: { leagueId },
  });

  const [addTeamsToLeague] = useMutation(ADD_TEAMS_TO_LEAGUE_MUTATION);
  const [removeTeamFromLeague] = useMutation(REMOVE_TEAM_FROM_LEAGUE_MUTATION);

  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);

  if (loadingTeams || loadingLeagueTeams) return <Loader />;
  if (errorTeams || errorLeagueTeams)
    return <ErrorMessage message={errorTeams?.message || errorLeagueTeams?.message} />;

  const allTeams = dataTeams?.teams || [];
  const leagueTeams = dataLeagueTeams?.league?.teams || [];

  // Filter out teams that are already in the league
  const availableTeams = allTeams.filter(
    (team: { id: number }) => !leagueTeams.some((leagueTeam: { id: number }) => leagueTeam.id === team.id)
  );


  const handleAddTeams = async () => {
    if (selectedTeams.length === 0) {
      toast.error("Please select at least one team.");
      return;
    }

    try {
      await addTeamsToLeague({
        variables: { leagueId, teamIds: selectedTeams },
        refetchQueries: [{ query: GET_LEAGUE_TEAMS_QUERY, variables: { leagueId } }],
      });
      setSelectedTeams([]);
      refetchLeagueTeams();
      toast.success("Teams added to the league successfully!");
    } catch (error) {
      console.error("Error adding teams to league:", error);
      toast.error("Failed to add teams to the league.");
    }
  };

  const handleRemoveTeam = async (teamId: number) => {
    try {
      await removeTeamFromLeague({
        variables: { leagueId, teamId },
        refetchQueries: [{ query: GET_LEAGUE_TEAMS_QUERY, variables: { leagueId } }],
      });
      toast.success("Team removed from the league successfully!");
    } catch (error) {
      console.error("Error removing team from league:", error);
      toast.error("Failed to remove team from the league.");
    }
  };

  return (
    <div className="container mx-auto p-4 dark:bg-gray-800 bg-white">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Manage Teams for League
      </h1>
      <div>
        <h3 className="text-xl font-semibold mb-2 mt-2 text-gray-900 dark:text-gray-100 ">
          Add Teams to League
        </h3>
        <MultiSelect options={availableTeams} selected={selectedTeams} onChange={setSelectedTeams} />
        <button
          className="mt-4 p-2 bg-green-500 text-white rounded"
          onClick={handleAddTeams}
        >
          Add Teams
        </button>
      </div>
      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
      <LeagueTeams addedTeams={leagueTeams}  onRemoveTeam={handleRemoveTeam}/>
    </div>
  );
};

export default ManageTeams;
