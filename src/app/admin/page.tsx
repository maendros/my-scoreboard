"use client";

import React from "react";
import AddFixture from "@/components/features/fixtures/AddFixture";
import LeagueManager from "@/components/features/leagues/LeagueManager";

const AdminPage: React.FC = () => {
  return (
    <LeagueManager title="Admin Panel: Manage Fixtures">
      {(leagueId) => <AddFixture leagueId={leagueId} />}
    </LeagueManager>
  );
};

export default AdminPage;
