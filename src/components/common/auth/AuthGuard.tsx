"use client";

import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import React, { ReactNode, isValidElement } from "react";
import { GET_CURRENT_USER } from "@/hooks/useUserAccess";
import type { UserData } from "@/hooks/useUserAccess";
import Loader from "../ui/Loader";

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

interface WithUserData {
  userData?: UserData;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
  const { data: userData, loading } = useQuery(GET_CURRENT_USER);
  const router = useRouter();

  if (loading) {
    return <Loader />;
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

  // Pass user data to child component if it's a valid React element
  if (isValidElement<WithUserData>(children)) {
    return React.cloneElement(children, { userData: userData?.me as UserData });
  }

  return <>{children}</>;
};

export default AuthGuard;
