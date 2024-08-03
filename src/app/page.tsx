import React from "react";
import Scoreboard from "@/components/Scoreboard";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-600 ">
      <h1 className="text-center text-3xl font-bold  text-gray-900 dark:text-gray-100 ">
        My Scoreboard
      </h1>
      <Scoreboard />
    </div>
  );
};

export default Home;
