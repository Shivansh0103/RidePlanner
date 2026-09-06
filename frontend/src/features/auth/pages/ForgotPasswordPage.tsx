import React from "react";

import { ForgotPasswordForm } from "../components/ForgotPasswordForm";
import { AuthLayout } from "../layouts/AuthLayout";

export default function ForgotPasswordPage(): React.ReactElement {
  return (
    <AuthLayout
      title="Recover Access"
      subtitle="Request a secure password reset link for your cockpit"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
