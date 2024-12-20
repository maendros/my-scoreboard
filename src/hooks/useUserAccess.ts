import { gql, useQuery } from "@apollo/client";

export type UserData = {
  id: string;
  role: string;
  name: string;
  email: string;
  image?: string;
  provider?: string;
};

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      role
      name
      email
      image
      provider
    }
  }
`;

export const useUserAccess = (initialUserData?: UserData) => {
  const { data: userData } = useQuery(GET_CURRENT_USER, {
    skip: !!initialUserData,
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-only",
  });

  const user = initialUserData || userData?.me;
  const userRole = user?.role || "PUBLIC";

  return {
    isViewer: userRole === "VIEWER",
    isEditor: userRole === "EDITOR",
    isAdmin: userRole === "ADMIN",
    canEdit: ["ADMIN", "EDITOR"].includes(userRole),
    role: userRole,
    user,
  };
};
