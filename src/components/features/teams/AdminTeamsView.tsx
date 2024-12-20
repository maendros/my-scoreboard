import { useQuery, useMutation } from "@apollo/client";

import { useEffect, useState } from "react";
import Loader from "@/components/common/ui/Loader";
import ErrorMessage from "@/components/common/ui/ErrorMessage";
import { toast } from "react-toastify";
import { GET_ALL_TEAMS_AND_USERS, ASSIGN_TEAM } from "@/graphql/teams";
import { FiSave, FiUserX } from "react-icons/fi";

const AdminTeamsView = () => {
  const { data, loading, error } = useQuery(GET_ALL_TEAMS_AND_USERS);
  const [assignTeam] = useMutation(ASSIGN_TEAM);
  const [selectedUsers, setSelectedUsers] = useState<{ [key: number]: string }>(
    {}
  );

  useEffect(() => {
    if (data?.teams) {
      const currentAssignments = data.teams.reduce(
        (acc: { [key: number]: string }, team: any) => {
          if (team.userId) {
            acc[team.id] = team.userId.toString();
          }
          return acc;
        },
        {}
      );
      setSelectedUsers(currentAssignments);
    }
  }, [data?.teams]);
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  const handleAssignTeam = async (teamId: number) => {
    const userId = selectedUsers[teamId];
    if (!userId) return;
    try {
      await assignTeam({
        variables: {
          teamId,
          userId: parseInt(userId),
        },
        refetchQueries: [{ query: GET_ALL_TEAMS_AND_USERS }],
      });
      toast.success("Team assigned successfully!");
      // Clear the selection for this team
      setSelectedUsers((prev) => {
        const newState = { ...prev };
        delete newState[teamId];
        return newState;
      });
    } catch (error) {
      toast.error("Failed to assign team");
    }
  };

  const handleUnassignTeam = async (teamId: number) => {
    try {
      await assignTeam({
        variables: {
          teamId,
          userId: null,
        },
        refetchQueries: [{ query: GET_ALL_TEAMS_AND_USERS }],
      });
      toast.success("Team unassigned successfully!");
      setSelectedUsers((prev) => {
        const newState = { ...prev };
        delete newState[teamId];
        return newState;
      });
    } catch (error) {
      toast.error("Failed to unassign team");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 text-gray-900 dark:text-gray-100">
        {data?.teams.map((team: any) => (
          <div
            key={team.id}
            className="p-4 border rounded-lg shadow-sm bg-base-darker"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: team.profile.color }}
              />
              <h3 className="font-semibold">{team.name}</h3>
            </div>
            <div className="text-sm text-gray-500 mb-4">
              {team.user ? (
                <p>Assigned to: {team.user.email}</p>
              ) : (
                <p>Unassigned</p>
              )}
            </div>
            <div className="flex gap-2">
              <select
                className="w-full p-2 border rounded bg-gray-300 dark:bg-gray-800"
                value={selectedUsers[team.id] || ""}
                onChange={(e) => {
                  setSelectedUsers((prev) => ({
                    ...prev,
                    [team.id]: e.target.value,
                  }));
                }}
              >
                <option value="">Assign to user...</option>
                {data?.users?.map((user: any) => (
                  <option key={user.id} value={user.id}>
                    {user.email}
                  </option>
                ))}
              </select>
              {selectedUsers[team.id] && (
                <button
                  onClick={() => handleAssignTeam(team.id)}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  title="Save assignment"
                >
                  <FiSave className="w-5 h-5" />
                </button>
              )}
              {team.userId && (
                <button
                  onClick={() => handleUnassignTeam(team.id)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  title="Remove assignment"
                >
                  <FiUserX className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTeamsView;
