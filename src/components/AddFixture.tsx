"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { toast } from "react-toastify";
import FixtureGaming from "./FixtureGaming";
import LoadingButton from "./LoadingButton";
import ConfirmationDialog from "./ConfirmationDialog";
import Divider from "./Divider";

type Score = {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  homeTeamDetails: { chosenTeam?: string };
  awayTeamDetails: { chosenTeam?: string };
};

const init_score: Score = {
  homeTeam: "",
  awayTeam: "",
  homeScore: 0,
  awayScore: 0,
  homeTeamDetails: { chosenTeam: "" },
  awayTeamDetails: { chosenTeam: "" },
};

const COMBINED_QUERY = gql`
  query CombinedQuery($leagueId: Int!, $daysLimit: Int) {
    league(id: $leagueId) {
      id
      name
      teams {
        id
        name
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
        homeTeamDetails
        awayTeamDetails
      }
    }
  }
`;

const ADD_FIXTURES_MUTATION = gql`
  mutation AddFixtures($fixtures: FixtureInput!) {
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

const UPDATE_FIXTURE_MUTATION = gql`
  mutation UpdateFixture($id: Int!, $fixture: FixtureInput!) {
    updateFixture(id: $id, fixture: $fixture) {
      id
      homeScore
      awayScore
      homeTeamDetails
      awayTeamDetails
    }
  }
`;

const DELETE_FIXTURE_MUTATION = gql`
  mutation DeleteFixture($id: Int!) {
    deleteFixture(id: $id)
  }
`;

const AddFixture: React.FC<{ leagueId: number }> = ({ leagueId }) => {
  const { loading, error, data } = useQuery(COMBINED_QUERY, {
    variables: {
      leagueId,
      daysLimit: 1,
    },
  });
  const [addFixture] = useMutation(ADD_FIXTURES_MUTATION);
  const [updateFixture] = useMutation(UPDATE_FIXTURE_MUTATION);
  const [deleteFixture] = useMutation(DELETE_FIXTURE_MUTATION, {
    refetchQueries: [
      {
        query: COMBINED_QUERY,
        variables: { leagueId, daysLimit: 1 },
      },
    ],
  });
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    itemIndex: -1,
  });

  const initializeScores = () => {
    const todayMatches = data?.groupedFixtures?.[0]?.matches || [];
    if (todayMatches.length > 0) {
      return todayMatches.map((match: any) => ({
        id: match.id,
        homeTeam: match.homeTeam.id.toString(),
        awayTeam: match.awayTeam.id.toString(),
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        homeTeamDetails: match.homeTeamDetails || {
          chosenTeam: "",
        },
        awayTeamDetails: match.awayTeamDetails || {
          chosenTeam: "",
        },
      }));
    }
    return [{ ...init_score }];
  };
  const [scores, setScores] = useState<(Score & { id?: number })[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setScores(initializeScores());
    }
  }, [data]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  const teams = data?.league?.teams || [];
  const todaysFixtures = data?.groupedFixtures || [];

  const handleAddScore = () => {
    setScores([...scores, { ...init_score }]);
  };

  const handleRemoveScore = async (index: number) => {
    const score = scores[index];
    if (score.id) {
      try {
        await deleteFixture({
          variables: { id: score.id },
        });
        toast.success("Fixture deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete fixture");
        return;
      }
    }
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

  const handleSave = async (score: Score & { id?: number }) => {
    try {
      setIsSaving(true);
      const fixtureData = {
        leagueId,
        homeTeamId: Number(score.homeTeam),
        awayTeamId: Number(score.awayTeam),
        homeScore: score.homeScore,
        awayScore: score.awayScore,
        playedAt: new Date().toISOString(),
        homeTeamDetails: { chosenTeam: score.homeTeamDetails.chosenTeam },
        awayTeamDetails: { chosenTeam: score.awayTeamDetails.chosenTeam },
      };

      if (score.id) {
        await updateFixture({
          variables: {
            id: score.id,
            fixture: fixtureData,
          },
        });
      } else {
        await addFixture({
          variables: {
            fixtures: fixtureData,
          },
        });
      }
      toast.success("Fixture saved successfully!");
    } catch (error) {
      toast.error(`Failed to save fixture: ${error}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveConfirmation = (index: number) => {
    setDialogState({
      isOpen: true,
      itemIndex: index,
    });
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Add Fixtures
      </h2>
      <ConfirmationDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, itemIndex: -1 })}
        onConfirm={() => {
          if (dialogState.itemIndex !== -1) {
            handleRemoveScore(dialogState.itemIndex);
          }
        }}
        title="Confirm Deletion"
        message="Are you sure you want to delete this fixture?"
      />

      {scores.map((score, index) => (
        <div key={index} className="mb-6">
          <Divider />
          <div className="grid grid-cols-12 gap-2 mb-4">
            {/* Home Team Select */}
            <select
              className="col-span-4 sm:col-span-3 p-2 border border-gray-700 dark:bg-gray-800 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* Home Score Input */}
            <input
              type="number"
              min="0"
              className="col-span-2 sm:col-span-1 p-2 border border-gray-700 dark:bg-gray-800 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={score.homeScore}
              onChange={(e) =>
                handleInputChange(index, "homeScore", Number(e.target.value))
              }
            />

            {/* Away Score Input */}
            {/* Away Team Select */}
            <select
              className="col-span-4 sm:col-span-3  p-2 border border-gray-700 dark:bg-gray-800 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <input
              type="number"
              min="0"
              className="col-span-2 sm:col-span-1  p-2 border border-gray-700 dark:bg-gray-800 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={score.awayScore}
              onChange={(e) =>
                handleInputChange(index, "awayScore", Number(e.target.value))
              }
            />

            <div className="sm:col-span-4" />
          </div>

          <div className="grid grid-cols-12 gap-2 mb-4">
            {/* Home Team Details */}
            <FixtureGaming
              details={score.homeTeamDetails}
              onChange={(details) =>
                handleInputChange(index, "homeTeamDetails", details)
              }
            />

            {/* Away Team Details */}
            <FixtureGaming
              details={score.awayTeamDetails}
              onChange={(details) =>
                handleInputChange(index, "awayTeamDetails", details)
              }
            />
            <div className="sm:col-span-4" />
          </div>

          <div className="flex gap-2 mt-4">
            <button
              className="w-full sm:w-auto p-2 bg-red-500 text-white rounded-md"
              onClick={() => handleRemoveConfirmation(index)}
            >
              Remove
            </button>

            <LoadingButton
              onClick={() => handleSave(score)}
              isLoading={isSaving}
              disabled={!score.homeTeam || !score.awayTeam}
              className="w-full sm:w-auto"
              color="green"
            >
              Save
            </LoadingButton>
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        <button
          className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={handleAddScore}
        >
          Add Score
        </button>
      </div>
    </>
  );
};

export default AddFixture;
