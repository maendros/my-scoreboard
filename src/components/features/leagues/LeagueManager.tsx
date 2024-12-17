"use client";

import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import Loader from "@/components/common/ui/Loader";
import ErrorMessage from "@/components/common/ui/ErrorMessage";
import LeagueSelector from "@/components/features/leagues/LeagueSelector";

// GraphQL Query to Fetch Leagues
const GET_LEAGUES_QUERY = gql`
  query GetLeagues {
    leagues {
      id
      name
    }
  }
`;

interface LeagueManagerProps {
  children: (leagueId: number) => React.ReactNode; // Function to render child based on leagueId
  title: string;
}

const LeagueManager: React.FC<LeagueManagerProps> = ({ children, title }) => {
  const { loading, error, data } = useQuery(GET_LEAGUES_QUERY);
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  const leagues = data?.leagues || [];

  // Auto-select the first league if none is selected
  if (!selectedLeagueId && leagues.length > 0) {
    setSelectedLeagueId(leagues[0].id);
  }

  return (
    <div className="container mx-auto p-4 dark:bg-gray-800 bg-white">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {title}
      </h1>

      {/* League Selector */}
      <LeagueSelector
        leagues={leagues}
        selectedLeagueId={selectedLeagueId}
        onLeagueSelect={setSelectedLeagueId}
      />

      {/* Render child based on selected league */}
      {selectedLeagueId ? (
        children(selectedLeagueId)
      ) : (
        <p className="text-center text-gray-500">Please select a league.</p>
      )}
    </div>
  );
};

export default LeagueManager;
