const LeagueTeams: React.FC<{ addedTeams: { id: number; name: string }[] }> = ({
    addedTeams,
  }) => {
    return (
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Teams in this League</h3>
        {addedTeams.length > 0 ? (
          <ul className="list-disc pl-5 max-h-48 overflow-y-auto">
            {addedTeams.map((team) => (
              <li key={team.id} className="text-gray-900 dark:text-gray-100">
                {team.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No teams added yet.</p>
        )}
      </div>
    );
  };
  