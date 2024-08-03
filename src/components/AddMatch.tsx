"use client";

import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";

const GET_USERS_QUERY = gql`
  query GetUsers {
    users {
      id
      name
    }
  }
`;

const AddMatch: React.FC = () => {
  const { loading, error, data } = useQuery(GET_USERS_QUERY);
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
    const newRows = [...rows];
    newRows[index][field as keyof (typeof newRows)[0]] = value;
    setRows(newRows);
  };

  const handleSave = () => {
    console.log("Saving data:", rows);
    // Here you could call a mutation to save the data to your server
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add Matches</h2>
      {rows.map((row, index) => (
        <div key={index} className="flex items-center mb-2">
          <select
            className="mr-2 p-2 border dark:bg-gray-700 dark:text-gray-300"
            value={row.homeTeam}
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
            className="mr-2 p-2 border dark:bg-gray-700 dark:text-gray-300"
            value={row.awayTeam}
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
            className="mr-2 p-2 border dark:bg-gray-700 dark:text-gray-300"
            value={row.homeScore}
            onChange={(e) =>
              handleInputChange(index, "homeScore", Number(e.target.value))
            }
          />
          <input
            type="number"
            className="mr-2 p-2 border dark:bg-gray-700 dark:text-gray-300"
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
        className="mt-4 ml-4 p-2 bg-green-500 text-white"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
};

export default AddMatch;
