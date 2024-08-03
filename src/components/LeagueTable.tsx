"use client";

import React from "react";

interface LeagueTableProps {
  data: {
    team: {
      id: string;
      name: string;
    };
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
  }[];
}

const LeagueTable: React.FC<LeagueTableProps> = ({ data }) => {
  return (
    <table className="min-w-full bg-black border-collapse">
      <thead>
        <tr>
          <th className="border px-4 py-2">Team</th>
          <th className="border px-4 py-2">Played</th>
          <th className="border px-4 py-2">Won</th>
          <th className="border px-4 py-2">Drawn</th>
          <th className="border px-4 py-2">Lost</th>
          <th className="border px-4 py-2">Goals For</th>
          <th className="border px-4 py-2">Goals Against</th>
          <th className="border px-4 py-2">Goal Difference</th>
          <th className="border px-4 py-2">Points</th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry) => (
          <tr key={entry.team.id}>
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
