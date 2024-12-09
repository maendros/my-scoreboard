"use client";

import React from "react";

interface LeagueSelectorProps {
  leagues: { id: number; name: string }[];
  selectedLeagueId: number | null;
  onLeagueSelect: (leagueId: number) => void;
}

const LeagueSelector: React.FC<LeagueSelectorProps> = ({
  leagues,
  selectedLeagueId,
  onLeagueSelect,
}) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-gray-900 dark:text-gray-100">
        Select League:
      </label>
      <select
        className=" p-2 border border-gray-700 dark:bg-gray-800 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        value={selectedLeagueId || ""}
        onChange={(e) => onLeagueSelect(Number(e.target.value))}
      >
        <option value="" disabled>
          Select a League
        </option>
        {leagues.map((league) => (
          <option key={league.id} value={league.id}>
            {league.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LeagueSelector;
