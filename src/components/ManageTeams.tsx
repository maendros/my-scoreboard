"use client";

import React, { useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { toast } from "react-toastify";
import MultiSelect from "./MultiSelect";


// GraphQL Queries and Mutations for Leagues
const GET_LEAGUES_QUERY = gql`
  query GetLeagues {
    leagues {
      id
      name
      profile
      teams {
        id
        name
      }
    }
  }
`;

const GET_TEAMS_QUERY = gql`
  query GetTeams {
    teams {
      id
      name
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

interface ManageTeamsProps {
  leagueId: number; // Define the prop type
}

const ManageTeams: React.FC<ManageTeamsProps> = ({ leagueId }) => {
  const { loading: loadingTeams, error: errorTeams, data: dataTeams } = useQuery(GET_TEAMS_QUERY);

  const [addTeamsToLeague] = useMutation(ADD_TEAMS_TO_LEAGUE_MUTATION);
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);

  if (loadingTeams) return <Loader />;
  if (errorTeams) return <ErrorMessage message={errorTeams.message} />;

  const teams = dataTeams?.teams || [];

  const handleAddTeams = async () => {
    if (selectedTeams.length === 0) {
      toast.error("Please select at least one team.");
      return;
    }

    try {
      await addTeamsToLeague({
        variables: { leagueId, teamIds: selectedTeams },
      });

      setSelectedTeams([]);
      toast.success("Teams added to the league successfully!");
    } catch (error) {
      console.error("Error adding teams to league:", error);
      toast.error("Failed to add teams to the league.");
    }
  };

  return (
    <div className="container mx-auto p-4 dark:bg-gray-800 bg-white">
      <h2 className="text-2xl  font-bold mb-4 text-gray-900 dark:text-gray-100">
        Add Teams to League
      </h2>
      <MultiSelect
        options={teams} // Pass your teams array here
        selected={selectedTeams}
        onChange={setSelectedTeams}
       />
      <button
        className="p-2 bg-green-500 text-white ml-2"
        onClick={handleAddTeams}
      >
        Add Teams
      </button>
    </div>
  );
};

export default ManageTeams;
