import { useQuery, useMutation } from "@apollo/client";

import { useState } from "react";
import Loader from "@/components/common/ui/Loader";
import ErrorMessage from "@/components/common/ui/ErrorMessage";
import ColorPicker from "@/components/common/ui/ColorPicker";
import { toast } from "react-toastify";
import { GET_USER_TEAMS, UPDATE_USER_TEAM } from "@/graphql/teams";

const UserTeamsView = ({ userId }: { userId: string }) => {
  const { data, loading, error } = useQuery(GET_USER_TEAMS, {
    skip: !userId,
    variables: { userId },
  });
  const [updateTeam] = useMutation(UPDATE_USER_TEAM);

  const [editedTeams, setEditedTeams] = useState<Record<number, any>>({});

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  const handleUpdateTeam = async (id: number) => {
    const editedTeam = editedTeams[id];
    if (!editedTeam) return;

    try {
      await updateTeam({
        variables: {
          id,
          team: {
            name: editedTeam.name,
            profile: { color: editedTeam.color },
          },
        },
      });
      toast.success("Team updated successfully!");
    } catch (error) {
      toast.error("Failed to update team");
    }
  };

  const handleInputChange = (id: number, field: string, value: any) => {
    console.log({ id, field, value });
    setEditedTeams((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data?.myTeams.map((team: { id: number; name: string; profile: any }) => {
        const editedTeam = editedTeams[team.id] || {
          name: team.name,
          color: team.profile?.color || "#000000",
        };
        return (
          <div
            key={team.id}
            className="p-4 border rounded-lg shadow-sm bg-base-darker"
          >
            <div className="space-y-4">
              <input
                type="text"
                value={editedTeam.name}
                onChange={(e) =>
                  handleInputChange(team.id, "name", e.target.value)
                }
                className={`w-full p-2 border rounded dark:bg-gray-800 bg-gray-300`}
              />
              <div className="flex items-center gap-2">
                <ColorPicker
                  value={editedTeam.color}
                  onChange={(color) =>
                    handleInputChange(team.id, "color", color)
                  }
                />
              </div>

              <button
                onClick={() => handleUpdateTeam(team.id)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserTeamsView;
