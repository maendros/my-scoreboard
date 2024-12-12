"use client";

import { Bar, Pie } from "react-chartjs-2";

interface TeamStatsChartProps {
  stats: {
    wins: number;
    draws: number;
    losses: number;
  };
  chartType?: "pie" | "bar";
}

const TeamStatsChart = ({ stats, chartType = "pie" }: TeamStatsChartProps) => {
  if (!stats) {
    return (
      <div className="text-center text-gray-500">
        No stats available to display
      </div>
    );
  }
  const labels = [
    `Wins (${stats.wins})`,
    `Draws (${stats.draws})`,
    `Losses (${stats.losses})`,
  ];
  const data = [stats.wins, stats.draws, stats.losses];

  const pieChartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)", // green for wins
          "rgba(234, 179, 8, 0.8)", // yellow for draws
          "rgba(239, 68, 68, 0.8)", // red for losses
        ],
        borderColor: [
          "rgb(34, 197, 94)",
          "rgb(234, 179, 8)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels,
    datasets: [
      {
        label: "Match Results",
        data,
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(234, 179, 8, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgb(34, 197, 94)",
          "rgb(234, 179, 8)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Match Results",
        color: "rgb(156, 163, 175)", // text-gray-400
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "rgb(156, 163, 175)", // text-gray-400
          font: {
            size: 12,
          },
        },
        grid: {
          color: "rgba(107, 114, 128, 0.1)", // gray-500 with opacity
        },
      },
      x: {
        ticks: {
          color: "rgb(156, 163, 175)", // text-gray-400
          font: {
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "rgb(156, 163, 175)", // text-gray-400
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
    },
  };

  return (
    <div className="w-full h-full">
      {chartType === "pie" ? (
        <Pie data={pieChartData} options={pieOptions} />
      ) : (
        <Bar data={barChartData} options={barOptions} />
      )}
    </div>
  );
};

export default TeamStatsChart;
