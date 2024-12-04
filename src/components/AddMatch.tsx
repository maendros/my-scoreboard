"use client";

import React, { useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { toast } from "react-toastify";

const GET_TEAMS_QUERY = gql`
  query GetTeams {
    teams {
      id
      name
    }
  }
`;

const ADD_MATCHES_MUTATION = gql`
  mutation AddMatches($matches: [MatchInput!]!) {
    addMatches(matches: $matches) {
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

const AddMatch: React.FC = () => {
  const { loading, error, data } = useQuery(GET_TEAMS_QUERY);
  const [addMatches] = useMutation(ADD_MATCHES_MUTATION);
  const [rows, setRows] = useState([
    { homeTeam: "", awayTeam: "", homeScore: 0, awayScore: 0 },
  ]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  const users = data?.users || [];

  const handleAddRow = () => {
    setRows([
      ...rows,
      { homeTeam: "", awayTeam: "", homeScore: 0, awayScore: 0 },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    if (typeof value === "number" && value < 0) return; // Prevent negative numbers
    const newRows = [...rows];
    newRows[index][field as keyof (typeof newRows)[0]] = value;
    setRows(newRows);
  };

  const isSaveDisabled = rows.some((row) => !row.homeTeam || !row.awayTeam);
  console.log(isSaveDisabled);

  const handleSave = async () => {
    const matches = rows.map((row) => ({
      homeTeamId: Number(row.homeTeam), // Convert to integer
      awayTeamId: Number(row.awayTeam), // Convert to integer
      homeScore: Number(row.homeScore),
      awayScore: Number(row.awayScore),
      playedAt: new Date().toISOString(), // Automatically set the date
    }));

    try {
      await addMatches({ variables: { matches } });
      setRows([{ homeTeam: "", awayTeam: "", homeScore: 0, awayScore: 0 }]);
      toast.success("ScoreBoard updated!");
    } catch (error) {
      console.error("Error adding matches:", error);
      toast.error(`Scoreboard update failed: ${error}`);
    }
  };

  return (
    <div className="container mx-auto p-4 dark:bg-gray-800 bg-white">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Add Matches
      </h2>
      {rows.map((row, index) => (
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
            {users.map((user: { id: number; name: string }) => (
              <option key={user.id} value={user.id}>
                {user.name}
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
            {users.map((user: { id: number; name: string }) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="0" // Prevent negative values
            className="mr-2 p-2 border dark:bg-gray-700 bg-white text-gray-900 dark:text-gray-100"
            value={row.homeScore}
            onChange={(e) =>
              handleInputChange(index, "homeScore", Number(e.target.value))
            }
          />
          <input
            type="number"
            min="0" // Prevent negative values
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
    </div>
  );
};

export default AddMatch;
