"use client";

import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import Loader from "@/components/Loader";
import ErrorMessage from "@/components/ErrorMessage";
import LeagueSelector from "@/components/LeagueSelector";
import AddFixture from "@/components/AddFixture";

// GraphQL Query to Fetch Leagues
const GET_LEAGUES_QUERY = gql`
  query GetLeagues {
    leagues {
      id
      name
    }
  }
`;

const AdminPage: React.FC = () => {
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
        Admin Panel: Manage Fixtures
      </h1>

      {/* League Selector */}
      <LeagueSelector
        leagues={leagues}
        selectedLeagueId={selectedLeagueId}
        onLeagueSelect={setSelectedLeagueId}
      />

      {/* Add Fixtures for Selected League */}
      {selectedLeagueId && <AddFixture leagueId={selectedLeagueId} />}
    </div>
  );
};

export default AdminPage;
