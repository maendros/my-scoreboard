"use client";

import React, { useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { toast } from "react-toastify";
import client from "@/lib/apolloClient";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import ColorPicker from "./ColorPicker";
import Checkbox from "./CheckBox";

// GraphQL Queries and Mutations for Leagues
const GET_LEAGUES_QUERY = gql`
  query GetLeagues {
    leagues {
      id
      name
      profile
      size
      isGamingLeague
    }
  }
`;

const ADD_LEAGUE_MUTATION = gql`
  mutation AddLeague($league: LeagueInput!) {
    addLeague(league: $league) {
      id
      name
      profile
      size
      isGamingLeague
    }
  }
`;

const UPDATE_LEAGUE_MUTATION = gql`
  mutation UpdateLeague($id: Int!, $league: LeagueInput!) {
    updateLeague(id: $id, league: $league) {
      id
      name
      profile
      size
      isGamingLeague
    }
  }
`;

const DELETE_LEAGUE_MUTATION = gql`
  mutation DeleteLeague($id: Int!) {
    deleteLeague(id: $id)
  }
`;

const Leagues: React.FC = () => {
  const { loading, error, data } = useQuery(GET_LEAGUES_QUERY);
  const [addLeague] = useMutation(ADD_LEAGUE_MUTATION);
  const [updateLeague] = useMutation(UPDATE_LEAGUE_MUTATION);
  const [deleteLeague] = useMutation(DELETE_LEAGUE_MUTATION);

  const [newLeague, setNewLeague] = useState({
    name: "",
    profile: { color: "" },
    size: 4, // Default league size
    isGamingLeague: false, // Default value for gaming league
  });

  const [editedLeagues, setEditedLeagues] = useState<
    Record<
      number,
      { name: string; color: string; size: number; isGamingLeague: boolean }
    >
  >({}); // Temporary state for edited leagues

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  const leagues = data?.leagues || [];

  const handleAddLeague = async () => {
    try {
      await addLeague({
        variables: {
          league: {
            name: newLeague.name,
            profile: newLeague.profile,
            size: newLeague.size,
            isGamingLeague: newLeague.isGamingLeague,
          },
        },
        refetchQueries: [{ query: GET_LEAGUES_QUERY }],
      });

      setNewLeague({
        name: "",
        profile: { color: "" },
        size: 4,
        isGamingLeague: false,
      });
      toast.success("League added successfully!");
    } catch (error) {
      console.error("Error adding league:", error);
      toast.error(`Failed to add league: ${error}`);
    }
  };

  const handleUpdateLeague = async (id: number) => {
    const editedLeague = editedLeagues[id];
    if (!editedLeague) return;

    try {
      await updateLeague({
        variables: {
          id: Number(id),
          league: {
            name: editedLeague.name,
            profile: { color: editedLeague.color || "#ff0000" },
            size: editedLeague.size,
            isGamingLeague: editedLeague.isGamingLeague,
          },
        },
      });
      setEditedLeagues((prev) => {
        const updated = { ...prev };
        delete updated[id]; // Clear temporary state after saving
        return updated;
      });
      toast.success("League updated successfully!");
    } catch (error) {
      console.error("Error updating league:", error);
      toast.error(`Failed to update league: ${error}`);
    }
  };

  const handleDeleteLeague = async (id: number) => {
    try {
      await deleteLeague({ variables: { id: Number(id) } });
      client.cache.updateQuery(
        { query: GET_LEAGUES_QUERY },
        (existingData) => ({
          leagues: (existingData?.leagues || []).filter(
            (league: Record<string, unknown>) => league.id !== id
          ),
        })
      );
      toast.success("League deleted successfully!");
    } catch (error) {
      console.error("Error deleting league:", error);
      toast.error(`Failed to delete league: ${error}`);
    }
  };

  const handleInputChange = (id: number, field: string, value: any) => {
    setEditedLeagues((prev) => {
      const currentLeague = leagues.find(
        (league: Record<string, unknown>) => league.id === id
      );
      const existingEdit = prev[id] || {
        name: currentLeague?.name || "",
        color: currentLeague?.profile?.color || "#000000",
        size: currentLeague?.size || 4,
        isGamingLeague: currentLeague?.isGamingLeague || false,
      };

      return {
        ...prev,
        [id]: {
          ...existingEdit,
          [field]: value,
        },
      };
    });
  };


  return (
    <div className="container mx-auto p-4 dark:bg-gray-800 bg-white">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Manage Leagues
      </h2>

      {/* Existing Leagues */}
      <div>
        {leagues.map(
          (league: {
            id: number;
            name: string;
            profile: any;
            size: number;
            isGamingLeague: boolean;
          }) => {
            const editedLeague = editedLeagues[league.id] || {
              name: league.name,
              color: league.profile?.color || "#000000",
              size: league.size,
              isGamingLeague: league.isGamingLeague,
            };

            return (
              <div
                key={league.id}
                className="flex items-center mb-2 dark:text-gray-100 text-gray-900"
              >
                <input
                  type="text"
                  value={editedLeague.name}
                  onChange={(e) =>
                    handleInputChange(league.id, "name", e.target.value)
                  }
                  className="mr-2 p-2 border border-gray-700 dark:bg-gray-800 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <ColorPicker
                  value={editedLeague.color}
                  onChange={(newColor) =>
                    handleInputChange(league.id, "color", newColor)
                  }
                  size={40}
                />
                <select
                  value={editedLeague.size}
                  onChange={(e) =>
                    handleInputChange(league.id, "size", Number(e.target.value))
                  }
                  className="mr-2 p-2 border border-gray-700 dark:bg-gray-800 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 29 }, (_, i) => i + 4).map((size) => (
                    <option key={size} value={size}>
                      {size} Teams
                    </option>
                  ))}
                </select>

                <Checkbox
                  id={`gaming-league-checkbox-${league.id}`}
                  label="Gaming League"
                  checked={editedLeague.isGamingLeague}
                  onChange={(checked) =>
                    handleInputChange(league.id, "isGamingLeague", checked)
                  }
                  className="me-4"
                />

                <button
                  className={`ml-2 p-2 text-white ${
                    editedLeague.name
                      ? "bg-green-500"
                      : "bg-gray-500 cursor-not-allowed"
                  }`}
                  onClick={() => handleUpdateLeague(league.id)}
                  disabled={!editedLeague.name}
                >
                  Save
                </button>

                <button
                  className="ml-2 p-2 bg-red-500 text-white"
                  onClick={() => handleDeleteLeague(league.id)}
                >
                  Delete
                </button>

                {/* Arrow Icon for Navigation */}
                <Link
                  href={`/leagues/${league.id}?name=${encodeURIComponent(
                    league.name
                  )}`}
                >
                  <button className="ml-2 p-2 bg-blue-500 text-white">
                    <FaArrowRight />
                  </button>
                </Link>
              </div>
            );
          }
        )}
      </div>

      {/* Add New League */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Add New League</h3>
        <div className="flex items-center mb-2 dark:text-gray-100 text-gray-900">
          {/* Name Input */}
          <input
            type="text"
            placeholder="Name"
            value={newLeague.name}
            onChange={(e) =>
              setNewLeague({ ...newLeague, name: e.target.value })
            }
            className="mr-2 p-2 border border-gray-700 dark:bg-gray-800 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Color Picker */}
          <ColorPicker
            value={newLeague.profile.color || "#000000"}
            onChange={(e) =>
              setNewLeague({ ...newLeague, profile: { color: e } })
            }
            size={40}
          />

          {/* League Size Dropdown */}
          <select
            value={newLeague.size}
            onChange={(e) =>
              setNewLeague({ ...newLeague, size: Number(e.target.value) })
            }
            className="mr-2 p-2 border border-gray-700 dark:bg-gray-800 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({ length: 29 }, (_, i) => i + 4).map((size) => (
              <option key={size} value={size}>
                {size} Teams
              </option>
            ))}
          </select>

          <Checkbox
            id="gaming-league-checkbox"
            label="Gaming League"
            checked={newLeague.isGamingLeague}
            onChange={(checked) =>
              setNewLeague({ ...newLeague, isGamingLeague: checked })
            }
            className="me-4"
          />

          {/* Add Button */}
          <button
            className={`p-2 text-white ${
              !newLeague.name
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-500"
            }`}
            onClick={handleAddLeague}
            disabled={!newLeague.name}
          >
            Add League
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leagues;
