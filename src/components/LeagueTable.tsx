"use client";

import React, { useState } from "react";
import TableHeaders from "./TableHeaders";
import ArrowUpIcon from "@heroicons/react/16/solid/ArrowUpIcon";
import ArrowDownIcon from "@heroicons/react/24/solid/ArrowDownIcon";

const LeagueTable: React.FC<{ data: any[] }> = ({ data }) => {
  const [sortField, setSortField] = useState<string>("points");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const headers = [
    { label: "Team", field: "team.name" },
    { label: "Played", field: "played" },
    { label: "Won", field: "won" },
    { label: "Drawn", field: "drawn" },
    { label: "Lost", field: "lost" },
    { label: "Goals For", field: "goalsFor" },
    { label: "Goals Against", field: "goalsAgainst" },
    { label: "Goal Difference", field: "goalDifference" },
    { label: "Points", field: "points" },
    { label: "Win Ratio (%)", field: "winRatio" },
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
    <table className="min-w-full bg-white dark:bg-gray-800 border-collapse">
      <thead>
        <tr className="text-gray-900 dark:text-gray-100">
          {headers.map((header) => (
            <th
              key={header.field}
              className="border px-4 py-2 cursor-pointer"
              onClick={() => handleSort(header.field)}
            >
              <div className="flex items-center">
                {header.label}
                {sortField === header.field && (
                  <span className="ml-2">
                    {sortOrder === "asc" ? (
                      <ArrowUpIcon className="h-4 w-4 inline" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 inline" />
                    )}
                  </span>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((entry) => (
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
            <td className="border px-4 py-2">{entry.winRatio.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeagueTable;
