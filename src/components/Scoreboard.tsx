"use client";

import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import LeagueTable from "./LeagueTable";
import Fixtures from "./Fixtures";
import Loader from "./Loader"; // Import the Loader component
import ErrorMessage from "./ErrorMessage"; // Import the ErrorMessage component

const LEAGUE_TABLE_QUERY = gql`
  query LeagueTable($leagueId: Int!) {
    leagueTable(leagueId: $leagueId) {
      team {
        id
        name
        profile # Includes team profile details (e.g., color, icon)
      }
      played
      won
      drawn
      lost
      goalsFor
      goalsAgainst
      goalDifference
      points
      winRatio
    }
  }
`;

const FIXTURES_QUERY = gql`
  query Fixtures($leagueId: Int) {
    matches(leagueId: $leagueId) {
      id
      homeTeam {
        id
        name
        profile # Includes home team profile details
      }
      awayTeam {
        id
        name
        profile # Includes away team profile details
      }
      homeScore
      awayScore
      playedAt
      league {
        id
        name
      }
    }
  }
`;

const Scoreboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"table" | "fixtures">("table");
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);

  const {
    loading: loadingTable,
    error: errorTable,
    data: dataTable,
    refetch: refetchTable,
  } = useQuery(LEAGUE_TABLE_QUERY, {
    variables: { leagueId: selectedLeagueId },
    skip: selectedLeagueId === null,
  });

  const {
    loading: loadingFixtures,
    error: errorFixtures,
    data: dataFixtures,
    refetch: refetchFixtures,
  } = useQuery(FIXTURES_QUERY, {
    variables: { leagueId: selectedLeagueId },
    skip: selectedLeagueId === null,
  });

  const handleLeagueChange = (leagueId: number) => {
    setSelectedLeagueId(leagueId);
    refetchTable({ leagueId });
    refetchFixtures({ leagueId });
  };

  if (loadingTable || loadingFixtures) return <Loader />;
  if (errorTable || errorFixtures)
    return (
      <ErrorMessage message={errorTable?.message || errorFixtures?.message} />
    );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        {/* League Selector */}
        <select
          value={selectedLeagueId || ""}
          onChange={(e) =>
            handleLeagueChange(Number(e.target.value) || 1)
          }
          className="mb-4 px-4 py-2 border rounded"
        >
          <option value="" disabled>
            Select a League
          </option>
          {/* Replace this with dynamic league options */}
          <option value="1">Premier League</option>
          <option value="2">La Liga</option>
          <option value="3">Bundesliga</option>
        </select>
      </div>

      <div className="mb-4">
        <button
          className={`px-4 py-2 ${
            activeTab === "table"
              ? "bg-blue-500 text-white"
              : "dark:bg-gray-500 bg-gray-200"
          }`}
          onClick={() => setActiveTab("table")}
        >
          League Table
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "fixtures"
              ? "bg-blue-500 text-white"
              : "dark:bg-gray-500 bg-gray-200"
          }`}
          onClick={() => setActiveTab("fixtures")}
        >
          Fixtures
        </button>
      </div>

      {selectedLeagueId === null ? (
        <p className="text-center text-gray-500">
          Please select a league to view data.
        </p>
      ) : activeTab === "table" ? (
        <>
          {dataTable?.leagueTable?.length > 0 ? (
            <LeagueTable data={dataTable.leagueTable} />
          ) : (
            <p className="text-center text-gray-500">
              No league table data available.
            </p>
          )}
        </>
      ) : (
        <>
          {dataFixtures?.matches?.length > 0 ? (
            <Fixtures data={dataFixtures.matches} />
          ) : (
            <p className="text-center text-gray-500">No fixtures available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Scoreboard;
