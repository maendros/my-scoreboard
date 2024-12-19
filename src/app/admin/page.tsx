"use client";

import React from "react";
import AddFixture from "@/components/features/fixtures/AddFixture";
import LeagueManager from "@/components/features/leagues/LeagueManager";
import AuthGuard from "@/components/common/auth/AuthGuard";

const AdminPage: React.FC = () => {
  return (
    <AuthGuard allowedRoles={["ADMIN", "EDITOR"]}>
      <LeagueManager title="Admin Panel: Manage Fixtures">
        {(leagueId) => <AddFixture leagueId={leagueId} />}
      </LeagueManager>
    </AuthGuard>
  );
};

export default AdminPage;
