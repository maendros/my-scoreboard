"use client";

import { Pie } from "react-chartjs-2";

type TeamStatsChartProps = {
  stats: { wins: number; draws: number; losses: number } | null;
};

const TeamStatsChart: React.FC<TeamStatsChartProps> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="text-center text-gray-500">
        No stats available to display
      </div>
    );
  }

  const data = {
    labels: [
      `Wins (${stats.wins})`,
      `Draws (${stats.draws})`,
      `Losses (${stats.losses})`,
    ],
    datasets: [
      {
        data: [stats.wins, stats.draws, stats.losses],
        backgroundColor: ["#22c55e", "#facc15", "#ef4444"], // Tailwind colors
      },
    ],
  };

  // Custom chart options to slow down animation and resize
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows you to control the chart's size with CSS
    animation: {
      duration: 2000, // Slow down the animation (2 seconds)
    },
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md ">
      {/* Pie chart with custom data and options */}
      <Pie data={data} options={options} />
    </div>
  );
};

export default TeamStatsChart;
