import AuthGuard from "@/components/common/auth/AuthGuard";
import Leagues from "@/components/features/leagues/Leagues";
import React from "react";

const Admin: React.FC = () => {
  return (
    <AuthGuard allowedRoles={["ADMIN", "EDITOR", "VIEWER"]}>
      <Leagues />
    </AuthGuard>
  );
};

export default Admin;
