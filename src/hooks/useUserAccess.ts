import { gql, useQuery } from "@apollo/client";

export const useUserAccess = () => {
  const { data: userData } = useQuery(gql`
    query GetCurrentUserFromCache {
      me @client {
        id
        role
      }
    }
  `);

  const userRole = userData?.me?.role || "PUBLIC";

  return {
    isViewer: userRole === "VIEWER",
    isEditor: userRole === "EDITOR",
    isAdmin: userRole === "ADMIN",
    canEdit: ["ADMIN", "EDITOR"].includes(userRole),
    role: userRole,
  };
};
