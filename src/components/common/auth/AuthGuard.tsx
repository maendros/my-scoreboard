"use client";

import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      role
    }
  }
`;

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
  const { data: userData, loading } = useQuery(GET_CURRENT_USER);
  const router = useRouter();

  if (loading) {
    return <div>Loading...</div>;
  }

  const userRole = userData?.me?.role;

  if (!userRole || !allowedRoles.includes(userRole)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
        <p className="text-gray-600">
          You don't have permission to access this page.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Home
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
