"use client";

import React, { useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { toast } from "react-toastify";
import client from "@/lib/apolloClient";
import ColorPicker from "./ColorPicker";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const GET_TEAMS_QUERY = gql`
  query GetTeams {
    teams {
      id
      name
      profile
    }
  }
`;

const ADD_TEAM_MUTATION = gql`
  mutation AddUTeam($team: TeamInput!) {
    addTeam(team: $team) {
      id
      name
      profile
    }
  }
`;

const UPDATE_TEAM_MUTATION = gql`
  mutation UpdateTeam($id: Int!, $team: TeamInput!) {
    updateTeam(id: $id, team: $team) {
      id
      name
      profile
    }
  }
`;

const DELETE_TEAM_MUTATION = gql`
  mutation DeleteTeam($id: Int!) {
    deleteTeam(id: $id)
  }
`;

const Teams: React.FC = () => {
  const { loading, error, data } = useQuery(GET_TEAMS_QUERY);
  const [addTeam] = useMutation(ADD_TEAM_MUTATION);
  const [updateTeam] = useMutation(UPDATE_TEAM_MUTATION);
  const [deleteTeam] = useMutation(DELETE_TEAM_MUTATION);

  const [newTeam, setNewTeam] = useState({
    name: "",
    profile: { color: "" },
  });

  const [editedTeams, setEditedTeams] = useState<
    Record<number, { name: string; color: string }>
  >({});

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  const teams = data?.teams || [];

  const handleAddTeam = async () => {
    try {
      await addTeam({
        variables: { team: newTeam },
        refetchQueries: [{ query: GET_TEAMS_QUERY }],
      });

      setNewTeam({ name: "", profile: { color: "" } });

      toast.success("Team added successfully!");
    } catch (error) {
      console.error("Error adding team:", error);
      toast.error(`Failed to add team: ${error}`);
    }
  };

  const handleUpdateTeam = async (id: number) => {
    const editedTeam = editedTeams[id];
    if (!editedTeam) return;

    try {
      await updateTeam({
        variables: {
          id: Number(id),
          team: {
            name: editedTeam.name,
            profile: { color: editedTeam.color || "#ff0000" },
          },
        },
      });
      setEditedTeams((prev) => {
        const updated = { ...prev };
        delete updated[id]; // Clear temporary state after saving
        return updated;
      });
      toast.success("Team updated successfully!");
    } catch (error) {
      console.error("Error updating team:", error);
      toast.error(`Failed to update team: ${error}`);
    }
  };

  const handleDeleteTeam = async (id: number) => {
    try {
      await deleteTeam({ variables: { id: Number(id) } });
      client.cache.updateQuery({ query: GET_TEAMS_QUERY }, (existingData) => ({
        teams: (existingData?.teams || []).filter(
          (team: Record<string, unknown>) => team.id !== id
        ),
      }));
      toast.success("Team deleted successfully!");
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error(`Failed to delete team: ${error}`);
    }
  };

  const handleInputChange = (id: number, field: string, value: string) => {
    setEditedTeams((prev) => {
      const currentTeam = teams.find(
        (team: Record<string, unknown>) => team.id === id
      );
      const existingEdit = prev[id] || {
        name: currentTeam?.name || "",
        color: currentTeam?.profile?.color || "#000000",
      };

      return {
        ...prev,
        [id]: {
          ...existingEdit, // Preserve other fields
          [field]: value, // Update the specific field
        },
      };
    });
  };

  const isAddDisabled = !newTeam.name;

  return (
    <div className="container mx-auto p-4 dark:bg-gray-800 bg-white">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Manage Teams
      </h2>

      <div>
        {teams.map((team: { id: number; name: string; profile: any }) => {
          const editedTeam = editedTeams[team.id] || {
            name: team.name,
            color: team.profile?.color || "#000000",
          };

          return (
            <div
              key={team.id}
              className="flex items-center mb-2 dark:text-gray-100 text-gray-900"
            >
              <input
                type="text"
                value={editedTeam.name}
                onChange={(e) =>
                  handleInputChange(team.id, "name", e.target.value)
                }
                className="mr-2 p-2 border dark:bg-gray-700 bg-white"
              />

              <ColorPicker
                value={editedTeam.color}
                onChange={(newColor) =>
                  handleInputChange(team.id, "color", newColor)
                }
                size={40}
              />

              <button
                className={`ml-2 p-2 text-white ${
                  editedTeam.name
                    ? "bg-green-500"
                    : "bg-gray-500 cursor-not-allowed"
                }`}
                onClick={() => handleUpdateTeam(team.id)}
                disabled={!editedTeam.name}
              >
                Save
              </button>

              <button
                className="ml-2 p-2 bg-red-500 text-white"
                onClick={() => handleDeleteTeam(team.id)}
              >
                Delete
              </button>
              {/* Arrow Icon for Navigation */}
              <Link
                href={`/teams/${team.id}?name=${encodeURIComponent(team.name)}`}
              >
                <button className="ml-2 p-2 bg-blue-500 text-white">
                  <FaArrowRight />
                </button>
              </Link>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Add New Team</h3>
        <div className="flex items-center mb-2 dark:text-gray-100 text-gray-900">
          <input
            type="text"
            placeholder="Name"
            value={newTeam.name}
            onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
            className="mr-2 p-2 border dark:bg-gray-700 bg-white"
          />
          <ColorPicker
            value={newTeam.profile.color}
            onChange={(e) => setNewTeam({ ...newTeam, profile: { color: e } })}
            size={40}
          />

          <button
            className={`p-2 text-white ${
              isAddDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-green-500"
            }`}
            onClick={handleAddTeam}
            disabled={isAddDisabled}
          >
            Add Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default Teams;
