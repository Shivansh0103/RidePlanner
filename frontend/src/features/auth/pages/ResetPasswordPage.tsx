import React from "react";
import { useSearchParams } from "react-router-dom";

import { ResetPasswordForm } from "../components/ResetPasswordForm";
import { AuthLayout } from "../layouts/AuthLayout";

export default function ResetPasswordPage(): React.ReactElement {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  return (
    <AuthLayout
      title="Establish New Password"
      subtitle="Secure your cockpit credentials with a new password"
    >
      <ResetPasswordForm userId={userId} token={token} />
    </AuthLayout>
  );
}
