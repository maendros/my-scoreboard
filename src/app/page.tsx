import dynamic from "next/dynamic";
import React from "react";

// Dynamically load Scoreboard without SSR
const Scoreboard = dynamic(() => import("../components/Scoreboard"), {
  ssr: false,
});

const Home: React.FC = () => {
  return <Scoreboard />;
};

export default Home;
