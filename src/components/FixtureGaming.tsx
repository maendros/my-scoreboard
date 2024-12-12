"use client";

import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";

const GET_GAMING_TEAMS_AND_FORMATIONS = gql`
  query GetGamingTeamsAndFormations {
    gamingTeams {
      id
      name
    }
    possibleFormations
  }
`;

const FixtureGaming: React.FC<{
  onChange: (details: { chosenTeam?: string; formation?: string }) => void;
  details: { chosenTeam?: string; formation?: string };
}> = ({ onChange, details }) => {
  const { data, loading, error } = useQuery(GET_GAMING_TEAMS_AND_FORMATIONS);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsTyping(true);

    if (value.trim()) {
      const filtered = data.gamingTeams.filter((team: any) =>
        team.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTeams(filtered);
    } else {
      setFilteredTeams([]);
    }
  };

  const handleSelectTeam = (team: { id: number; name: string }) => {
    onChange({ ...details, chosenTeam: team.name });
    setSearchTerm(team.name); // Overwrite input with selected team's name
    setIsTyping(false); // Close suggestions
  };

  const handleClearTeam = () => {
    setSearchTerm("");
    onChange({ ...details, chosenTeam: "" });
  };

  if (loading) return <p>Loading gaming teams...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const formations = data.possibleFormations;

  return (
    <>
      {/* Search for Teams */}
      <div className="col-span-12 sm:col-span-3 relative">
        <div className="flex items-center border border-gray-700 dark:bg-gray-800 bg-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
          <input
            type="text"
            className="p-2 w-full bg-transparent border border-gray-700 dark:bg-gray-800 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for a team..."
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setIsTyping(true)}
          />
          {searchTerm && (
            <button
              className="p-2 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              onClick={handleClearTeam}
              title="Clear input"
            >
              ✕
            </button>
          )}
        </div>
        {isTyping && filteredTeams.length > 0 && (
          <ul className="absolute z-10 bg-white dark:bg-gray-700 w-full border mt-1 max-h-40 overflow-y-auto">
            {filteredTeams.map((team: any) => (
              <li
                key={team.id}
                className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => handleSelectTeam(team)}
              >
                {team.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Formation Selector */}
      <div className="col-span-12 sm:col-span-1">
        <select
          className="w-full p-2 border border-gray-700 dark:bg-gray-800 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={details.formation || ""}
          onChange={(e) => onChange({ ...details, formation: e.target.value })}
        >
          <option value="">Select Formation</option>
          {formations.map((formation: string) => (
            <option key={formation} value={formation}>
              {formation}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default FixtureGaming;
