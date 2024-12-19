"use client";

import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import Loader from "@/components/common/ui/Loader";
import ErrorMessage from "@/components/common/ui/ErrorMessage";
import LeagueTable from "@/components/features/leagues/LeagueTable";
import Fixtures from "@/components/features/fixtures/Fixtures";

const TABLE_AND_FIXTURES_QUERY = gql`
  query TableAndFixtures($leagueId: Int!, $daysLimit: Int) {
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
    groupedFixtures(leagueId: $leagueId, daysLimit: $daysLimit) {
      day
      matches {
        id
        homeTeam {
          id
          name
          profile
        }
        awayTeam {
          id
          name
          profile
        }
        homeScore
        awayScore
        playedAt
        homeTeamDetails # Add this
        awayTeamDetails
      }
    }
  }
`;

interface ScoreboardProps {
  leagueId: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ leagueId }) => {
  const [activeTab, setActiveTab] = useState<"table" | "fixtures">("table");

  const { loading, error, data } = useQuery(TABLE_AND_FIXTURES_QUERY, {
    variables: { leagueId, daysLimit: 0 },
    skip: !leagueId,
  });

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error?.message} />;

  return (
    <>
      <div className="mb-4 flex flex-row">
        <button
          className={`w-full sm:w-32 px-4 py-2 ${
            activeTab === "table"
              ? "bg-blue-500 text-white"
              : "dark:bg-gray-500 bg-gray-200"
          }`}
          onClick={() => setActiveTab("table")}
        >
          League Table
        </button>
        <button
          className={`w-full sm:w-32 px-4 py-2 sm:mt-0 ${
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
          {data?.leagueTable?.length > 0 ? (
            <LeagueTable data={data.leagueTable} />
          ) : (
            <p className="text-center text-gray-500">
              No league table data available.
            </p>
          )}
        </>
      ) : (
        <>
          {data?.groupedFixtures?.length > 0 ? (
            <Fixtures data={data.groupedFixtures} />
          ) : (
            <p className="text-center text-gray-500">No fixtures available.</p>
          )}
        </>
      )}
    </>
  );
};

export default Scoreboard;
