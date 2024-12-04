"use client";

import ManageTeams from "@/components/ManageTeams";
import { useParams } from "next/navigation";

const LeaguePage: React.FC = () => {
  const params = useParams();
  const leagueId = parseInt(params.id as string, 10); // Explicitly cast `params.id` to `string`

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">Manage League: {leagueId}</h1>
      <ManageTeams leagueId={leagueId} /> {/* Pass leagueId as prop */}
    </div>
  );
};

export default LeaguePage;
