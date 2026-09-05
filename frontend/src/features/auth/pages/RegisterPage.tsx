import React from "react";

import { RegisterForm } from "../components/RegisterForm";
import { AuthLayout } from "../layouts/AuthLayout";

export default function RegisterPage(): React.ReactElement {
  return (
    <AuthLayout
      title="Create Rider Profile"
      subtitle="Establish your secure credentials for isolated trip workspace management"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
