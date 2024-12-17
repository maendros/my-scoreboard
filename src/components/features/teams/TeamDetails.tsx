import React, { useState } from "react";
import { Bar } from "react-chartjs-2";

interface TeamDetailsProps {
  teamId: number;
  fixtures: {
    id: number;
    homeTeamId: number;
    awayTeamId: number;
    homeTeamDetails: { chosenTeam: string };
    awayTeamDetails: { chosenTeam: string };
  }[];
}

const TeamDetails: React.FC<TeamDetailsProps> = ({ teamId, fixtures }) => {
  const [view, setView] = useState<"chart" | "table">("chart");

  // Get chosen teams for this team (whether home or away)
  const chosenTeamCounts = fixtures.reduce((acc, fixture) => {
    const isHome = fixture.homeTeamId === teamId;
    const details = isHome ? fixture.homeTeamDetails : fixture.awayTeamDetails;

    if (details?.chosenTeam) {
      acc[details.chosenTeam] = (acc[details.chosenTeam] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const totalGames = fixtures.length;

  const data = {
    labels: Object.keys(chosenTeamCounts),
    datasets: [
      {
        label: "Times Used",
        data: Object.values(chosenTeamCounts),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "rgb(156, 163, 175)", // gray-400 for better visibility in dark mode
        },
      },
      title: {
        display: true,
        text: "Team Formations Usage",
        color: "rgb(156, 163, 175)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: "rgb(156, 163, 175)",
        },
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
        },
      },
      x: {
        ticks: {
          color: "rgb(156, 163, 175)",
        },
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
        },
      },
    },
  };

  return (
    <>
      <div className="mb-4 md:mb-0 md:w-1/3">
        <div className="flex flex-col items-start">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Team Details
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setView("chart")}
              className={`px-4 py-2 rounded-md ${
                view === "chart"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
              }`}
            >
              Chart
            </button>
            <button
              onClick={() => setView("table")}
              className={`px-4 py-2 rounded-md ${
                view === "table"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      <div className="w-full md:w-2/3 h-[300px]">
        {view === "chart" ? (
          /* Bar Chart */
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg h-full">
            <Bar
              data={data}
              options={{
                ...options,
                maintainAspectRatio: false,
              }}
            />
          </div>
        ) : (
          /* Table View */
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg h-full">
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
              <table className="min-w-full">
                <thead className="sticky top-0 bg-white dark:bg-gray-700">
                  <tr className="border-b dark:border-gray-600">
                    <th className="text-left p-2 text-gray-800 dark:text-gray-200">
                      Formation
                    </th>
                    <th className="text-right p-2 text-gray-800 dark:text-gray-200">
                      Times Used
                    </th>
                    <th className="text-right p-2 text-gray-800 dark:text-gray-200">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(chosenTeamCounts)
                    .sort(([, a], [, b]) => b - a)
                    .map(([team, count]) => {
                      const percentage = ((count / totalGames) * 100).toFixed(
                        1
                      );
                      return (
                        <tr
                          key={team}
                          className="border-t dark:border-gray-600"
                        >
                          <td className="p-2 text-gray-800 dark:text-gray-200">
                            {team}
                          </td>
                          <td className="text-right p-2 text-gray-800 dark:text-gray-200">
                            {count}
                          </td>
                          <td className="text-right p-2 text-gray-800 dark:text-gray-200">
                            {percentage}%
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TeamDetails;
