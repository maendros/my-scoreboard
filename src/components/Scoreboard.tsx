"use client";

import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import LeagueTable from "./LeagueTable";
import Fixtures from "./Fixtures";
import Loader from "./Loader"; // Import the Loader component
import ErrorMessage from "./ErrorMessage"; // Import the ErrorMessage component

const LEAGUE_TABLE_QUERY = gql`
  query LeagueTable {
    leagueTable {
      team {
        id
        name
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
  query Fixtures {
    matches {
      id
      homeTeam {
        name
      }
      awayTeam {
        name
      }
      homeScore
      awayScore
      playedAt
    }
  }
`;

const Scoreboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("table");
  const {
    loading: loadingTable,
    error: errorTable,
    data: dataTable,
  } = useQuery(LEAGUE_TABLE_QUERY);
  const {
    loading: loadingFixtures,
    error: errorFixtures,
    data: dataFixtures,
  } = useQuery(FIXTURES_QUERY);

  if (loadingTable || loadingFixtures) return <Loader />;
  if (errorTable || errorFixtures)
    return (
      <ErrorMessage message={errorTable?.message || errorFixtures?.message} />
    );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <button
          className={`px-4 py-2 ${
            activeTab === "table"
              ? "bg-blue-500 text-white"
              : " dark:bg-gray-500 bg-gray-200"
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

      {activeTab === "table" && (
        <>
          {dataTable?.leagueTable.length > 0 ? (
            <LeagueTable data={dataTable.leagueTable} />
          ) : (
            <p className="text-center text-gray-500">
              No league data available.
            </p>
          )}
        </>
      )}

      {activeTab === "fixtures" && (
        <>
          {dataFixtures?.matches.length > 0 ? (
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
