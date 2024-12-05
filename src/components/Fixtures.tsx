"use client";

import React from "react";

const Fixtures: React.FC<{ data: { day: string; matches: any[] }[] }> = ({
  data,
}) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-4">
      {data.map((group, index) => (
        <div key={index} className="mb-6">
          {/* Day Header */}
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            {group.day}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {group.matches.map((match) => (
              <div
                key={match.id}
                className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <img
                      src={match.homeTeam.profile?.color || "/default-logo.png"}
                      alt={`${match.homeTeam.name} logo`}
                      className="h-8 w-8 rounded-full mr-2"
                    />
                    <span className="text-gray-900 dark:text-gray-100 font-bold">
                      {match.homeTeam.name}
                    </span>
                  </div>
                  <span className="text-gray-900 dark:text-gray-100 font-semibold">
                    {match.homeScore} - {match.awayScore}
                  </span>
                  <div className="flex items-center">
                    <span className="text-gray-900 dark:text-gray-100 font-bold mr-2">
                      {match.awayTeam.name}
                    </span>
                    <img
                      src={match.awayTeam.profile?.logo || "/default-logo.png"}
                      alt={`${match.awayTeam.name} logo`}
                      className="h-8 w-8 rounded-full"
                    />
                  </div>
                </div>
                <div className="text-center text-sm text-gray-700 dark:text-gray-400">
                  {new Date(match.playedAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Fixtures;
