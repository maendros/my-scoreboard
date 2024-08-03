"use client";

import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import LeagueTable from "./LeagueTable";
import Fixtures from "./Fixtures";

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
      date
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

  if (loadingTable || loadingFixtures) return <p>Loading...</p>;
  if (errorTable || errorFixtures)
    return <p>Error: {errorTable?.message || errorFixtures?.message}</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <button
          className={`px-4 py-2 ${
            activeTab === "table" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("table")}
        >
          League Table
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "fixtures" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("fixtures")}
        >
          Fixtures
        </button>
      </div>
      {activeTab === "table" && <LeagueTable data={dataTable.leagueTable} />}
      {activeTab === "fixtures" && <Fixtures data={dataFixtures.matches} />}
    </div>
  );
};

export default Scoreboard;