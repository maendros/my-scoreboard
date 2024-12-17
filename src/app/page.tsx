"use client";

import React from "react";
import dynamic from "next/dynamic";
import LeagueManager from "@/components/features/leagues/LeagueManager";

// Dynamically load Scoreboard without SSR
const Scoreboard = dynamic(
  () => import("../components/common/layout/Scoreboard"),
  {
    ssr: false,
  }
);

const Home: React.FC = () => {
  return (
    <LeagueManager title="Welcome to the Scoreboard">
      {(leagueId) => <Scoreboard leagueId={leagueId} />}
    </LeagueManager>
  );
};

export default Home;
