import AuthGuard from "@/components/common/auth/AuthGuard";
import Teams from "@/components/features/teams/Teams";

const TeamsPage = () => {
  return (
    <AuthGuard allowedRoles={["ADMIN", "EDITOR", "VIEWER"]}>
      <Teams />
    </AuthGuard>
  );
};

export default TeamsPage;
