import React from "react";

import { LoginForm } from "../components/LoginForm";
import { AuthLayout } from "../layouts/AuthLayout";

export default function LoginPage(): React.ReactElement {
  return (
    <AuthLayout
      title="Rider Check-in"
      subtitle="Enter your credentials to access your routes and telemetry"
    >
      <LoginForm />
    </AuthLayout>
  );
}
