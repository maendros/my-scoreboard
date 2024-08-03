"use client";

import React from "react";

interface FixturesProps {
  data: {
    id: string;
    homeTeam: {
      name: string;
    };
    awayTeam: {
      name: string;
    };
    homeScore: number;
    awayScore: number;
    date: string;
  }[];
}

const Fixtures: React.FC<FixturesProps> = ({ data }) => {
  return (
    <table className="min-w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-collapse">
      <thead>
        <tr>
          <th className="border px-4 py-2">Home Team</th>
          <th className="border px-4 py-2">Away Team</th>
          <th className="border px-4 py-2">Score</th>
          <th className="border px-4 py-2">Date</th>
        </tr>
      </thead>
      <tbody>
        {data.map((match) => (
          <tr key={match.id}>
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
