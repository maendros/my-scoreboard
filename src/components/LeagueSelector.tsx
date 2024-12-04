"use client";

import React from "react";

interface League {
  id: number;
  name: string;
}

interface LeagueSelectorProps {
  leagues: League[];
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
        className="p-2 border dark:bg-gray-700 bg-white text-gray-900 dark:text-gray-100 rounded"
        value={selectedLeagueId || ""}
        onChange={(e) => onLeagueSelect(Number(e.target.value))}
      >
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
