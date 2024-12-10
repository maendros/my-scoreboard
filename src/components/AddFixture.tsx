"use client";

import React, { useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { toast } from "react-toastify";
import FixtureGaming from "./FixtureGaming";

type Score = {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  homeTeamDetails: { chosenTeam?: string; formation?: string };
  awayTeamDetails: { chosenTeam?: string; formation?: string };
};

const init_score: Score = {
  homeTeam: "",
  awayTeam: "",
  homeScore: 0,
  awayScore: 0,
  homeTeamDetails: { chosenTeam: "", formation: "" },
  awayTeamDetails: { chosenTeam: "", formation: "" },
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
      homeTeamDetails
      awayTeamDetails
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
  const [scores, setScores] = useState<Score[]>([{ ...init_score }]);
  const [isSaving, setIsSaving] = useState(false);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  const teams = dataLeagueTeams?.league?.teams || [];

  const handleAddScore = () => {
    setScores([...scores, { ...init_score }]);
  };

  const handleRemoveScore = (index: number) => {
    setScores(scores.filter((_, i) => i !== index));
  };

  const handleInputChange = <K extends keyof Score>(
    index: number,
    field: K,
    value: Score[K]
  ) => {
    if (typeof value === "number" && value < 0) return;
    const newScores = [...scores];
    newScores[index][field] = value;
    setScores(newScores);
  };

  const isSaveDisabled = scores.some(
    (score) => !score.homeTeam || !score.awayTeam
  );

  const handleSave = async () => {
    const fixtures = scores.map((score) => ({
      leagueId,
      homeTeamId: Number(score.homeTeam),
      awayTeamId: Number(score.awayTeam),
      homeScore: score.homeScore,
      awayScore: score.awayScore,
      playedAt: new Date().toISOString(),
      homeTeamDetails: score.homeTeamDetails,
      awayTeamDetails: score.awayTeamDetails,
    }));

    try {
      setIsSaving(true); // Start loader
      await addFixture({ variables: { fixtures } });
      setScores([{ ...init_score }]); // Reset scores
 
      toast.success("Fixtures added successfully!");
    } catch (error) {

      toast.error(`Failed to add fixtures: ${error}`);
    } finally {
      setIsSaving(false); // Stop loader
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Add Fixtures
      </h2>
      {isSaving ? (
        <Loader /> // Show loader during saving
      ) : (
        scores.map((score, index) => (
          <div key={index} className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {/* Home Team Select */}
              <select
                className="flex-1 min-w-[45%] sm:min-w-0 p-2 border border-gray-700 dark:bg-gray-800 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={score.homeTeam || ""}
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

              {/* Away Team Select */}
              <select
                className="flex-1 min-w-[45%] sm:min-w-0 p-2 border border-gray-700 dark:bg-gray-800 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={score.awayTeam || ""}
                onChange={(e) =>
                  handleInputChange(index, "awayTeam", e.target.value)
                }
              >
                <option value="" disabled>
                  Select Away Team
                </option>
                {teams
                  .filter(
                    (team: { id: number }) => team.id !== Number(score.homeTeam)
                  )
                  .map((team: { id: number; name: string }) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
              </select>

              {/* Home Score Input */}
              <input
                type="number"
                min="0"
                className="w-full sm:w-16 flex-1 p-2 border border-gray-700 dark:bg-gray-800 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={score.homeScore}
                onChange={(e) =>
                  handleInputChange(index, "homeScore", Number(e.target.value))
                }
              />

              {/* Away Score Input */}
              <input
                type="number"
                min="0"
                className="w-full sm:w-auto flex-1 p-2 border border-gray-700 dark:bg-gray-800 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={score.awayScore}
                onChange={(e) =>
                  handleInputChange(index, "awayScore", Number(e.target.value))
                }
              />

              {/* Remove Button */}
 
  
            </div>

            {/* Home Team Details */}
            <div className="mb-4 w-auto sm:w-1/2">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                Home Team Details
              </h3>
              <FixtureGaming
                details={score.homeTeamDetails}
                onChange={(details) =>
                  handleInputChange(index, "homeTeamDetails", details)
                }
              />
            </div>

            {/* Away Team Details */}
            <div className="mb-4 w-auto sm:w-1/2">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                Away Team Details
              </h3>
              <FixtureGaming
                details={score.awayTeamDetails}
                onChange={(details) =>
                  handleInputChange(index, "awayTeamDetails", details)
                }
              />
            </div>
            {scores?.length > 1 &&(
                  <button
                    className="w-full sm:w-auto p-2 bg-red-500 text-white rounded-md"
                    onClick={() => handleRemoveScore(index)}
                  >
                  Remove
                </button>
              )}
          </div>
          
        ))
      )}
      {/* Add Score Button */}
      <div className="flex flex-wrap gap-2">
        <button
          className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={handleAddScore}
        >
          Add Score
        </button>
        <button
          className={`w-full sm:w-auto px-4 py-2 text-white rounded-md ${
            isSaveDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-green-500"
          }`}
          onClick={handleSave}
          disabled={isSaveDisabled}
        >
          Save
        </button>
      </div>
    </>

  );
};

export default AddFixture;
