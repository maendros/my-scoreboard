import React from "react";
import Scoreboard from "@/components/Scoreboard";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-center text-3xl font-bold my-4">My Scoreboard</h1>
      <Scoreboard />
    </div>
  );
};

export default Home;
