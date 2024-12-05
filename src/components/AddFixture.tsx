"use client";

import React, { useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { toast } from "react-toastify";

type Score = {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
};

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

const ADD_FIXTURES_MUTATION = gql`
  mutation AddFixtures($fixtures: [FixtureInput!]!) {
    addFixtures(fixtures: $fixtures) {
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

const AddFixture: React.FC<{ leagueId: number }> = ({ leagueId }) => {
  const {
    loading,
    error,
    data: dataLeagueTeams,
  } = useQuery(GET_LEAGUE_TEAMS_QUERY, {
    variables: { leagueId },
  });
  const [addFixture] = useMutation(ADD_FIXTURES_MUTATION);
  const [scores, setScores] = useState<Score[]>([
    { homeTeam: "", awayTeam: "", homeScore: 0, awayScore: 0 },
  ]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  const teams = dataLeagueTeams?.league?.teams || [];

  const handleAddRow = () => {
    setScores([
      ...scores,
      { homeTeam: "", awayTeam: "", homeScore: 0, awayScore: 0 },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    setScores(scores.filter((_, i) => i !== index));
  };

  const handleInputChange = <K extends keyof Score>(
    index: number,
    field: K,
    value: Score[K]
  ) => {
    if (typeof value === "number" && value < 0) return; // Prevent negative numbers
    const newScores = [...scores];
    newScores[index][field] = value;
    setScores(newScores);
  };

  const isSaveDisabled = scores.some((row) => !row.homeTeam || !row.awayTeam);

  const handleSave = async () => {
    const fixtures = scores.map((row) => ({
      leagueId, // Use leagueId passed from the parent
      homeTeamId: Number(row.homeTeam),
      awayTeamId: Number(row.awayTeam),
      homeScore: Number(row.homeScore),
      awayScore: Number(row.awayScore),
      playedAt: new Date().toISOString(),
    }));

    try {
      await addFixture({ variables: { fixtures } });
      setScores([{ homeTeam: "", awayTeam: "", homeScore: 0, awayScore: 0 }]);
      toast.success("Fixtures added to the league!");
    } catch (error) {
      console.error("Error adding fixtures:", error);
      toast.error(`Failed to add fixtures: ${error}`);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Add Fixtures
      </h2>
      {scores.map((row, index) => (
        <div key={index} className="flex items-center mb-2">
          <select
            className="mr-2 p-2 border dark:bg-gray-700 bg-white text-gray-900 dark:text-gray-100"
            value={row.homeTeam || ""}
            onChange={(e) =>
              handleInputChange(index, "homeTeam", e.target.value)
            }
          >
            <option value="" disabled>
              Select Home Team
            </option>
            {teams.map((team: { id: number; name: string }) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          <select
            className="mr-2 p-2 border dark:bg-gray-700 bg-white text-gray-900 dark:text-gray-100"
            value={row.awayTeam || ""}
            onChange={(e) =>
              handleInputChange(index, "awayTeam", e.target.value)
            }
          >
            <option value="" disabled>
              Select Away Team
            </option>
            {teams
              .filter(
                (team: { id: number }) => team.id !== Number(row.homeTeam)
              ) // Exclude selected home team
              .map((team: { id: number; name: string }) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
          </select>
          <input
            type="number"
            min="0"
            className="mr-2 p-2 border dark:bg-gray-700 bg-white text-gray-900 dark:text-gray-100"
            value={row.homeScore}
            onChange={(e) =>
              handleInputChange(index, "homeScore", Number(e.target.value))
            }
          />
          <input
            type="number"
            min="0"
            className="mr-2 p-2 border dark:bg-gray-700 bg-white text-gray-900 dark:text-gray-100"
            value={row.awayScore}
            onChange={(e) =>
              handleInputChange(index, "awayScore", Number(e.target.value))
            }
          />
          <button
            className="ml-2 p-2 bg-red-500 text-white"
            onClick={() => handleRemoveRow(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        className="mt-4 p-2 bg-blue-500 text-white"
        onClick={handleAddRow}
      >
        Add Row
      </button>
      <button
        className={`mt-4 ml-4 p-2 text-white ${
          isSaveDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-green-500"
        }`}
        onClick={handleSave}
        disabled={isSaveDisabled}
      >
        Save
      </button>
    </>
  );
};

export default AddFixture;
