"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { LoginWizard } from "@/components/features/auth/LoginWizard";

export default function LoginPage() {
  return (
    <AuthGuard publicOnly>
      <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-md">
          <LoginWizard />
        </div>
      </div>
    </AuthGuard>
  );
}
