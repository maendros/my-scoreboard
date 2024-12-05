"use client";

import React from "react";
import AddFixture from "@/components/AddFixture";
import LeagueManager from "@/components/LeagueManager";

const AdminPage: React.FC = () => {
  return (
    <LeagueManager title="Admin Panel: Manage Fixtures">
      {(leagueId) => <AddFixture leagueId={leagueId} />}
    </LeagueManager>
  );
};

export default AdminPage;
