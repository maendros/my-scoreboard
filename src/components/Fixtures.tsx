"use client";

import React from "react";
import TableHeaders from "./TableHeaders"; // Import the TableHeaders component

const Fixtures: React.FC<{ data: any[] }> = ({ data }) => {
  const headers = ["Home Team", "Away Team", "Score", "Date"];

  return (
    <table className="min-w-full bg-white dark:bg-gray-800 border-collapse">
      <TableHeaders
        headers={headers}
        className="text-gray-900 dark:text-gray-100"
      />
      <tbody>
        {data.map((match) => (
          <tr key={match.id} className="text-gray-800 dark:text-gray-200">
            <td className="border px-4 py-2">{match.homeTeam.name}</td>
            <td className="border px-4 py-2">{match.awayTeam.name}</td>
            <td className="border px-4 py-2">
              {match.homeScore} - {match.awayScore}
            </td>
            <td className="border px-4 py-2">
              {new Date(match.date).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Fixtures;
