"use client";

import React, { useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { toast } from "react-toastify";
import client from "@/lib/apolloClient";

const GET_USERS_QUERY = gql`
  query GetUsers {
    users {
      id
      name
      profile
    }
  }
`;

const ADD_USER_MUTATION = gql`
  mutation AddUser($user: UserInput!) {
    addUser(user: $user) {
      id
      name
      profile
    }
  }
`;

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: Int!, $user: UserInput!) {
    updateUser(id: $id, user: $user) {
      id
      name
      profile
    }
  }
`;

const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id)
  }
`;

const Users: React.FC = () => {
  const { loading, error, data } = useQuery(GET_USERS_QUERY);
  const [addUser] = useMutation(ADD_USER_MUTATION);
  const [updateUser] = useMutation(UPDATE_USER_MUTATION);
  const [deleteUser] = useMutation(DELETE_USER_MUTATION);

  const [newUser, setNewUser] = useState({
    name: "",
    profile: { color: "" },
  });

  const [editedUsers, setEditedUsers] = useState<
    Record<number, { name: string; color: string }>
  >({}); // Temporary state for edited users

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  const users = data?.users || [];

  const handleAddUser = async () => {
    try {
      await addUser({
        variables: { user: newUser },
        refetchQueries: [{ query: GET_USERS_QUERY }],
      });

      setNewUser({ name: "", profile: { color: "" } });

      toast.success("User added successfully!");
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error(`Failed to add user: ${error}`);
    }
  };

  const handleUpdateUser = async (id: number) => {
    const editedUser = editedUsers[id];
    if (!editedUser) return;

    try {
      await updateUser({
        variables: {
          id: Number(id),
          user: {
            name: editedUser.name,
            email: null,
            profile: { color: editedUser.color || "#ff0000" },
          },
        },
      });
      setEditedUsers((prev) => {
        const updated = { ...prev };
        delete updated[id]; // Clear temporary state after saving
        return updated;
      });
      toast.success("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(`Failed to update user: ${error}`);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser({ variables: { id: Number(id) } });
      client.cache.updateQuery({ query: GET_USERS_QUERY }, (existingData) => ({
        users: (existingData?.users || []).filter(
          (user: Record<string, unknown>) => user.id !== id
        ),
      }));
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(`Failed to delete user: ${error}`);
    }
  };

  const handleInputChange = (id: number, field: string, value: string) => {
    setEditedUsers((prev) => {
      // Populate `editedUsers` for this user with existing data from `users` if not already edited
      const currentUser = users.find(
        (user: Record<string, unknown>) => user.id === id
      );
      const existingEdit = prev[id] || {
        name: currentUser?.name || "",
        color: currentUser?.profile?.color || "#000000",
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

  const isAddDisabled = !newUser.name;

  return (
    <div className="container mx-auto p-4 dark:bg-gray-800 bg-white">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Manage Users
      </h2>

      {/* Existing Users */}
      <div>
        {users.map((user: { id: number; name: string; profile: any }) => {
          const editedUser = editedUsers[user.id] || {
            name: user.name,
            color: user.profile?.color || "#000000",
          };

          return (
            <div
              key={user.id}
              className="flex items-center mb-2 dark:text-gray-100 text-gray-900"
            >
              <input
                type="text"
                value={editedUser.name}
                onChange={(e) =>
                  handleInputChange(user.id, "name", e.target.value)
                }
                className="mr-2 p-2 border dark:bg-gray-700 bg-white"
              />

              <input
                type="color"
                value={editedUser.color}
                onChange={(e) =>
                  handleInputChange(user.id, "color", e.target.value)
                }
                className="mr-2 p-2 border"
              />

              <button
                className={`ml-2 p-2 text-white ${
                  editedUser.name
                    ? "bg-green-500"
                    : "bg-gray-500 cursor-not-allowed"
                }`}
                onClick={() => handleUpdateUser(user.id)}
                disabled={!editedUser.name}
              >
                Save
              </button>

              <button
                className="ml-2 p-2 bg-red-500 text-white"
                onClick={() => handleDeleteUser(user.id)}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>

      {/* Add New User */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Add New User</h3>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="mr-2 p-2 border dark:bg-gray-700 bg-white"
        />
        <input
          type="color"
          value={newUser.profile.color || "#000000"}
          onChange={(e) =>
            setNewUser({ ...newUser, profile: { color: e.target.value } })
          }
          className="mr-2 p-2 border"
        />
        <button
          className={`p-2 text-white ${
            isAddDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-green-500"
          }`}
          onClick={handleAddUser}
          disabled={isAddDisabled}
        >
          Add User
        </button>
      </div>
    </div>
  );
};

export default Users;
