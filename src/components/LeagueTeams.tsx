import React from "react";
import { FiTrash2 } from "react-icons/fi"; // Import a trash icon

const LeagueTeams: React.FC<{
  addedTeams: { id: number; name: string }[];
  onRemoveTeam: (teamId: number) => void; // Callback to remove team
}> = ({ addedTeams, onRemoveTeam }) => {
  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Teams in this League
      </h3>
      {addedTeams.length > 0 ? (
        <ul className="space-y-2 max-max-h-48 overflow-y-auto">
          {addedTeams.map((team) => (
            <li
              key={team.id}
              className="flex justify-between items-center p-2 rounded bg-gray-100 dark:bg-gray-700 shadow hover:shadow-lg transition w-1/3"
            >
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {team.name}
              </span>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => onRemoveTeam(team.id)}
                title="Remove team from league"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No teams added yet.</p>
      )}
    </div>
  );
};

export default LeagueTeams;
