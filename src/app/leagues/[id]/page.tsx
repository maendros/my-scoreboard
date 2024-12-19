"use client";

import AuthGuard from "@/components/common/auth/AuthGuard";
import ManageTeams from "@/components/features/teams/ManageTeams";
import { useParams, useSearchParams } from "next/navigation";

const LeaguePage: React.FC = () => {
  const params = useParams();
  const leagueId = parseInt(params.id as string, 10); // Explicitly cast `params.id` to `string`
  const searchParams = useSearchParams();
  const leagueName = searchParams.get("name");

  return (
    <AuthGuard allowedRoles={["ADMIN", "EDITOR"]}>
      <div>
        <h1 className="text-2xl font-bold mb-4 text-center">
          Manage League: {leagueName}
        </h1>
        <ManageTeams leagueId={leagueId} />
      </div>
    </AuthGuard>
  );
};

export default LeaguePage;
