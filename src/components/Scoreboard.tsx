"use client";

import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import LeagueTable from "./LeagueTable";
import Fixtures from "./Fixtures";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";

const LEAGUE_TABLE_QUERY = gql`
  query LeagueTable($leagueId: Int!) {
    leagueTable(leagueId: $leagueId) {
      team {
        id
        name
        profile
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
      lastFiveMatches {
        result
      }
    }
  }
`;

const GROUPED_FIXTURES_QUERY = gql`
  query GroupedFixtures($leagueId: Int, $daysLimit: Int) {
    groupedFixtures(leagueId: $leagueId, daysLimit: $daysLimit) {
      day
      matches {
        id
        homeTeam {
          id
          name
        }
        awayTeam {
          id
          name
        }
        homeScore
        awayScore
        playedAt
      }
    }
  }
`;

interface ScoreboardProps {
  leagueId: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ leagueId }) => {
  const [activeTab, setActiveTab] = useState<"table" | "fixtures">("table");

  const {
    loading: loadingTable,
    error: errorTable,
    data: dataTable,
  } = useQuery(LEAGUE_TABLE_QUERY, {
    variables: { leagueId },
    skip: !leagueId,
  });

  const {
    loading: loadingFixtures,
    error: errorFixtures,
    data: dataFixtures,
  } = useQuery(GROUPED_FIXTURES_QUERY, {
    variables: { leagueId, daysLimit: 5 },
    skip: !leagueId,
  });

  if (loadingTable || loadingFixtures) return <Loader />;
  if (errorTable || errorFixtures)
    return (
      <ErrorMessage message={errorTable?.message || errorFixtures?.message} />
    );
  console.log(dataFixtures);

  return (
    <>
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

      {activeTab === "table" ? (
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
          {dataFixtures?.groupedFixtures?.length > 0 ? (
            <Fixtures data={dataFixtures.groupedFixtures} />
          ) : (
            <p className="text-center text-gray-500">No fixtures available.</p>
          )}
        </>
      )}
    </>
  );
};

export default Scoreboard;
