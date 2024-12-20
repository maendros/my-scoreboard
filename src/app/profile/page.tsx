import AuthGuard from "@/components/common/auth/AuthGuard";

import ProfileContent from "@/components/features/profile/ProfileContent";
import React from "react";

const Profile: React.FC = () => {
  return (
    <AuthGuard allowedRoles={["ADMIN", "EDITOR", "VIEWER"]}>
      <ProfileContent />
    </AuthGuard>
  );
};

export default Profile;
