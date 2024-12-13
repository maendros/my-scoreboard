"use client";

import { gql, useQuery } from "@apollo/client";
import { Line } from "react-chartjs-2";
import Loader from "./Loader";
import { useState } from "react";

// GraphQL Query for League Progression
const GET_LEAGUE_PROGRESSION = gql`
  query GetLeagueProgression($leagueId: Int!) {
    leagueProgression(leagueId: $leagueId) {
      leagueId
      teams {
        teamId
        teamName
        progression {
          matchday
          points
          position
        }
      }
    }
  }
`;

// Color palette for team lines
const TEAM_COLORS = [
  "#3b82f6", // Tailwind blue
  "#22c55e", // Tailwind green
  "#f43f5e", // Tailwind rose
  "#8b5cf6", // Tailwind purple
  "#f97316", // Tailwind orange
  "#14b8a6", // Tailwind teal
  "#ef4444", // Tailwind red
  "#a855f7", // Tailwind purple
];

// Add this interface above the component
interface Progression {
  matchday: number;
  points: number;
  position: number;
}

const LeagueProgressionChart: React.FC<{ leagueId: number | null }> = ({
  leagueId,
}) => {
  const { data, loading, error } = useQuery(GET_LEAGUE_PROGRESSION, {
    variables: { leagueId },
  });

  // State to manage visible teams
  const [visibleTeams, setVisibleTeams] = useState<number[]>([]);

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="text-red-500">Error loading league progression.</div>
    );

  const { teams } = data.leagueProgression;

  // Prepare chart data
  const chartData = {
    labels: teams[0].progression.map(
      (_: number, index: number) => `Match ${index + 1}`
    ),
    datasets: teams.map((team: any, index: number) => ({
      label: team.teamName,
      data: team.progression.map((p: Progression) => ({
        x: p.matchday,
        y: p.points,
      })),
      borderColor: TEAM_COLORS[index % TEAM_COLORS.length],
      backgroundColor: `${TEAM_COLORS[index % TEAM_COLORS.length]}22`, // Transparent fill
      hidden: !visibleTeams.includes(team.teamId) && visibleTeams.length > 0,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true as const,
        text: "League Progression - Team Standings",
      },
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        reverse: false, // Lower number means higher position
        title: {
          display: true as const,
          text: "League Position",
        },
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        title: {
          display: true,
          text: "Matches",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LeagueProgressionChart;
