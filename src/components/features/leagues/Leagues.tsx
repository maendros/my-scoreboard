"use client";

import React, { useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import Loader from "@/components/common/ui/Loader";
import ErrorMessage from "@/components/common/ui/ErrorMessage";
import { toast } from "react-toastify";
import client from "@/lib/apolloClient";
import { FaArrowRight } from "react-icons/fa";
import { FiSave, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import ColorPicker from "@/components/common/ui/ColorPicker";
import Checkbox from "@/components/common/ui/CheckBox";
import ConfirmationDialog from "@/components/common/feedback/ConfirmationDialog";
import Divider from "@/components/common/ui/Divider";

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

  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    type: "save" | "remove" | "add";
    leagueId?: number;
    leagueName?: string;
  }>({
    isOpen: false,
    type: "save",
  });

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  const leagues = data?.leagues || [];

  const handleAddLeague = () => {
    setDialogState({
      isOpen: true,
      type: "add",
      leagueName: newLeague.name,
    });
  };

  const handleUpdateLeague = (id: number) => {
    const editedLeague = editedLeagues[id];
    if (!editedLeague) return;

    setDialogState({
      isOpen: true,
      type: "save",
      leagueId: id,
      leagueName: editedLeague.name,
    });
  };

  const handleDeleteLeague = (id: number) => {
    const league = leagues.find((l: any) => l.id === id);
    setDialogState({
      isOpen: true,
      type: "remove",
      leagueId: id,
      leagueName: league?.name,
    });
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

  const handleConfirmedUpdate = async (id: number) => {
    const editedLeague = editedLeagues[id];
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
        delete updated[id];
        return updated;
      });
      toast.success("League updated successfully!");
    } catch (error) {
      console.error("Error updating league:", error);
      toast.error(`Failed to update league: ${error}`);
    }
  };

  const handleConfirmedDelete = async (id: number) => {
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

  const handleConfirmedAdd = async () => {
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
              <>
                <Divider />
                <div key={league.id} className="mb-4 flex flex-col sm:flex-row">
                  {/* First row - always visible */}
                  <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-0">
                    <input
                      type="text"
                      value={editedLeague.name}
                      onChange={(e) =>
                        handleInputChange(league.id, "name", e.target.value)
                      }
                      className="w-1/2 sm:w-auto flex-grow sm:flex-grow-0 p-2 border border-gray-700 dark:bg-gray-800 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <select
                      value={editedLeague.size}
                      onChange={(e) =>
                        handleInputChange(
                          league.id,
                          "size",
                          Number(e.target.value)
                        )
                      }
                      className="w-24 p-2 border border-gray-700 dark:bg-gray-800 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Array.from({ length: 29 }, (_, i) => i + 4).map(
                        (size) => (
                          <option key={size} value={size}>
                            {size} Teams
                          </option>
                        )
                      )}
                    </select>

                    <ColorPicker
                      value={editedLeague.color}
                      onChange={(newColor) =>
                        handleInputChange(league.id, "color", newColor)
                      }
                      size={40}
                    />
                  </div>

                  {/* Second row - actions and checkbox */}
                  <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2">
                    <Checkbox
                      id={`gaming-league-checkbox-${league.id}`}
                      label="Gaming League"
                      checked={editedLeague.isGamingLeague}
                      onChange={(checked) =>
                        handleInputChange(league.id, "isGamingLeague", checked)
                      }
                      className="ml-2"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        className={`p-2 ${
                          editedLeague.name
                            ? "text-green-500"
                            : "text-gray-500 cursor-not-allowed"
                        }`}
                        onClick={() => handleUpdateLeague(league.id)}
                        disabled={!editedLeague.name}
                        title="Save league"
                      >
                        <FiSave className="w-6 h-6" />
                      </button>

                      <button
                        className="text-red-500 hover:text-red-700 p-2"
                        onClick={() => handleDeleteLeague(league.id)}
                        title="Delete league"
                      >
                        <FiTrash2 className="w-6 h-6" />
                      </button>

                      <Link
                        href={`/leagues/${league.id}?name=${encodeURIComponent(
                          league.name
                        )}`}
                      >
                        <button className="text-blue-500 p-2">
                          <FaArrowRight className="w-6 h-6" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            );
          }
        )}
      </div>

      {/* Add New League */}
      <div className="mt-20">
        <Divider topText="Add New League" />
        <div className="flex flex-col gap-4">
          {/* First row */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Name"
              value={newLeague.name}
              onChange={(e) =>
                setNewLeague({ ...newLeague, name: e.target.value })
              }
              className="w-full sm:w-auto flex-grow sm:flex-grow-0 p-2 border border-gray-700 dark:bg-gray-800 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={newLeague.size}
              onChange={(e) =>
                setNewLeague({ ...newLeague, size: Number(e.target.value) })
              }
              className="w-24 p-2 border border-gray-700 dark:bg-gray-800 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 29 }, (_, i) => i + 4).map((size) => (
                <option key={size} value={size}>
                  {size} Teams
                </option>
              ))}
            </select>

            <ColorPicker
              value={newLeague.profile.color || "#000000"}
              onChange={(e) =>
                setNewLeague({ ...newLeague, profile: { color: e } })
              }
              size={40}
            />
          </div>

          {/* Second row */}
          <div className="flex flex-wrap items-center gap-2">
            <Checkbox
              id="gaming-league-checkbox"
              label="Gaming League"
              checked={newLeague.isGamingLeague}
              onChange={(checked) =>
                setNewLeague({ ...newLeague, isGamingLeague: checked })
              }
              className="mr-auto"
            />

            <button
              className={`px-4 py-2 text-white rounded-md ${
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

      <ConfirmationDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ ...dialogState, isOpen: false })}
        onConfirm={() => {
          switch (dialogState.type) {
            case "save":
              dialogState.leagueId &&
                handleConfirmedUpdate(dialogState.leagueId);
              break;
            case "remove":
              dialogState.leagueId &&
                handleConfirmedDelete(dialogState.leagueId);
              break;
            case "add":
              handleConfirmedAdd();
              break;
          }
          setDialogState({ ...dialogState, isOpen: false });
        }}
        title={
          dialogState.type === "save"
            ? "Confirm Save"
            : dialogState.type === "remove"
            ? "Confirm Delete"
            : "Confirm Add"
        }
        message={
          dialogState.type === "save"
            ? `Are you sure you want to save changes to ${dialogState.leagueName}?`
            : dialogState.type === "remove"
            ? `Are you sure you want to delete ${dialogState.leagueName}?`
            : `Are you sure you want to add ${dialogState.leagueName}?`
        }
      />
    </div>
  );
};

export default Leagues;
