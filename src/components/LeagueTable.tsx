"use client";

import React from "react";
import TableHeaders from "./TableHeaders"; // Import the TableHeaders component

const LeagueTable: React.FC<{ data: any[] }> = ({ data }) => {
  const headers = [
    "Team",
    "Played",
    "Won",
    "Drawn",
    "Lost",
    "Goals For",
    "Goals Against",
    "Goal Difference",
    "Points",
  ];

  return (
    <table className="min-w-full bg-white dark:bg-gray-800 border-collapse">
      <TableHeaders
        headers={headers}
        className="text-gray-900 dark:text-gray-100"
      />
      <tbody>
        {data.map((entry) => (
          <tr key={entry.team.id} className="text-gray-800 dark:text-gray-200">
            <td className="border px-4 py-2">{entry.team.name}</td>
            <td className="border px-4 py-2">{entry.played}</td>
            <td className="border px-4 py-2">{entry.won}</td>
            <td className="border px-4 py-2">{entry.drawn}</td>
            <td className="border px-4 py-2">{entry.lost}</td>
            <td className="border px-4 py-2">{entry.goalsFor}</td>
            <td className="border px-4 py-2">{entry.goalsAgainst}</td>
            <td className="border px-4 py-2">{entry.goalDifference}</td>
            <td className="border px-4 py-2">{entry.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeagueTable;
