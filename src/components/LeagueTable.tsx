"use client";

import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaMinusCircle } from "react-icons/fa";
import ColoredDot from "./ColoredDot";
import Link from "next/link";

const LeagueTable: React.FC<{ data: any[] }> = ({ data }) => {
  const [sortField, setSortField] = useState<string>("winRatio");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const headers = [
    { tooltip: "Team", field: "team.name", label: "Team" },
    { tooltip: "Match played", field: "played", label: "M" },
    { tooltip: "Won", field: "won", label: "W" },
    { tooltip: "Drawn", field: "drawn", label: "D" },
    { tooltip: "Lost", field: "lost", label: "L" },
    { tooltip: "Goals For", field: "goalsFor", label: "GF" },
    { tooltip: "Goals Against", field: "goalsAgainst", label: "GA" },
    { tooltip: "Goal Difference", field: "goalDifference", label: "GD" },
    { tooltip: "Points", field: "points", label: "P" },
    { tooltip: "Win Ratio (%)", field: "winRatio", label: "WR" },
    { tooltip: "Last 5 Matches", field: "lastFiveMatches", label: "Last 5 " },
  ];

  const handleSort = (field: string) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const sortedData = [...data].sort((a, b) => {
    const getValue = (obj: any, path: string) =>
      path.split(".").reduce((acc, part) => acc && acc[part], obj);
    const valA = getValue(a, sortField);
    const valB = getValue(b, sortField);
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full bg-white text-gray-950 dark:bg-gray-900 dark:text-white border border-gray-700">
        <thead>
          <tr className="bg-gray-400 dark:bg-gray-800 text-left text-lg font-semibold">
            {headers.map((header) => (
              <th
                key={header.field}
                className="px-4 py-2 cursor-pointer relative group"
                onClick={() => handleSort(header.field)}
              >
                <div className="flex items-center">
                  {header.label}
                  {sortField === header.field && (
                    <span className="ml-2 text-sm">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </div>
                {/* Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none">
                  {header.tooltip}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((entry) => (
            <tr
              key={entry.team.id}
              className="text-md border-b border-gray-700 hover:bg-gray-800"
            >
              <td className="px-4 py-2 whitespace-nowrap bg-gray-200 dark:bg-slate-600 sticky left-0 z-10">
                <div className="flex items-center">
                  <ColoredDot color={entry.team.profile?.color} />
                  <span className="ml-2">
                    {" "}
                    <Link
                      href={`/teams/${entry.team.id}?name=${encodeURIComponent(
                        entry.team.name
                      )}`}
                    >
                      {entry.team.name}
                    </Link>
                  </span>
                </div>
              </td>
              <td className="px-4 py-2">{entry.played}</td>
              <td className="px-4 py-2">{entry.won}</td>
              <td className="px-4 py-2">{entry.drawn}</td>
              <td className="px-4 py-2">{entry.lost}</td>
              <td className="px-4 py-2">{entry.goalsFor}</td>
              <td className="px-4 py-2">{entry.goalsAgainst}</td>
              <td className="px-4 py-2">{entry.goalDifference}</td>
              <td className="px-4 py-2 font-bold">{entry.points}</td>
              <td className="px-4 py-2">{entry.winRatio.toFixed(2)}</td>
              <td className="px-4 py-2 flex justify-left">
                {entry.lastFiveMatches?.map(
                  (match: Record<string, unknown>, idx: number) => (
                    <span key={idx} className="mx-1">
                      {match.result === "win" ? (
                        <FaCheckCircle className="text-green-500 w-5 h-5" />
                      ) : match.result === "draw" ? (
                        <FaMinusCircle className="text-gray-500 w-5 h-5" />
                      ) : (
                        <FaTimesCircle className="text-red-500 w-5 h-5" />
                      )}
                    </span>
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeagueTable;
