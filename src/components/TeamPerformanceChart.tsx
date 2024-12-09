"use client";

import "chart.js/auto";
import { gql, useQuery } from "@apollo/client";
import { Line } from "react-chartjs-2";
import Loader from "./Loader";

// New GraphQL Query for Team Performance Evolution
const TEAM_PERFORMANCE_QUERY = gql`
  query TeamPerformanceEvolution($teamId: Int!, $leagueId: Int) {
    teamPerformanceEvolution(teamId: $teamId, leagueId: $leagueId) {
      teamId
      performanceData {
        matchNumber
        date
        opponent
        result
        points
        cumulativePoints
        goalDifference
        cumulativeGoalDifference
      }
    }
  }
`;

const TeamPerformanceChart: React.FC<{ teamId: number; leagueId?: number | null }> = ({
  teamId,
  leagueId,
}) => {
  const { data, loading, error } = useQuery(TEAM_PERFORMANCE_QUERY, {
    variables: { teamId, leagueId },
  });

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">Error loading team performance.</div>;

  const performanceData = data.teamPerformanceEvolution.performanceData;

  // Prepare data for Chart.js with multiple metrics
  const chartData = {
    labels: performanceData.map((item: any) => item.date),
    datasets: [
      {
        label: "Cumulative Points",
        data: performanceData.map((item: any) => item.cumulativePoints),
        borderColor: "#3b82f6", // Tailwind blue
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        yAxisID: 'y-points',
      },
      {
        label: "Cumulative Goal Difference",
        data: performanceData.map((item: any) => item.cumulativeGoalDifference),
        borderColor: "#22c55e", // Tailwind green
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        fill: true,
        yAxisID: 'y-goal-difference',
      },
      {
        label: "Match Points",
        data: performanceData.map((item: any) => item.points),
        borderColor: "#f43f5e", // Tailwind rose
        backgroundColor: "rgba(244, 63, 94, 0.2)",
        fill: true,
        yAxisID: 'y-points',
      }
    ],
  };
  console.log(chartData);
  

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Team Performance Evolution',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const datasetLabel = context.dataset.label || '';
            const dataPoint = context.parsed.y;
            const matchData = performanceData[context.dataIndex];
            
            // Enhance tooltip with additional match information
            return `${datasetLabel}: ${dataPoint} | Opponent: ${matchData.opponent} | Result: ${matchData.result}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Matches',
        }
      },
      'y-points': {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Points',
        }
      },
      'y-goal-difference': {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Goal Difference',
        },
        grid: {
          drawOnChartArea: false,
        }
      }
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-md ">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TeamPerformanceChart;