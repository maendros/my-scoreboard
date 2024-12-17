"use client";

import React from "react";
import ColoredDot from "@/components/common/ui/ColoredDot";
import Link from "next/link";

const Fixtures: React.FC<{ data: { day: string; matches: any[] }[] }> = ({
  data,
}) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-4">
      {data.map((group, index) => (
        <div key={index} className="mb-6">
          {/* Day Header */}
          <h2 className="text-lg font-bold dark:bg-slate-700 py-2 px-2 text-gray-900 dark:text-gray-100 mb-4 mx-auto w-full md:w-1/4 md:mx-0 ">
            {group.day}
          </h2>
          {/* Matches Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {group.matches.map((match) => (
              <div
                key={match.id}
                className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded shadow-md"
              >
                <div className="grid grid-cols-3 items-center mb-2">
                  {/* Home Team */}
                  <div className="flex items-center justify-start">
                    <span className=" font-bold">
                      <ColoredDot color={match.homeTeam.profile?.color} />
                      {"  "}
                      <Link
                        href={`/teams/${
                          match.homeTeam.id
                        }?name=${encodeURIComponent(match.homeTeam.name)}`}
                      >
                        {match.homeTeam.name}
                      </Link>
                    </span>
                  </div>
                  {/* Score */}
                  <div className="flex items-center justify-center">
                    <span className=" font-semibold">
                      {match.homeScore} - {match.awayScore}
                    </span>
                  </div>
                  {/* Away Team */}
                  <div className="flex items-center justify-end">
                    <span className=" font-bold">
                      <Link
                        href={`/teams/${
                          match.awayTeam.id
                        }?name=${encodeURIComponent(match.awayTeam.name)}`}
                      >
                        {match.awayTeam.name}
                      </Link>
                      {"  "}
                      <ColoredDot color={match.awayTeam.profile?.color} />
                    </span>
                  </div>
                </div>
                {/* Match Time */}
                <div className="grid grid-cols-3 items-center mb-2">
                  <div className="flex items-start justify-start">
                    {match.homeTeamDetails && (
                      <span className="text-sm text-gray-600 dark:text-gray-400 ">
                        {match.homeTeamDetails.chosenTeam || ""}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-sm text-gray-700 dark:text-gray-400 text-center">
                      {new Date(match.playedAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </div>
                  </div>
                  <div className="flex items-start justify-end">
                    {match.awayTeamDetails && (
                      <span className="text-sm text-gray-600 dark:text-gray-400 ">
                        {match.awayTeamDetails.chosenTeam || ""}
                      </span>
                    )}
                  </div>
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
