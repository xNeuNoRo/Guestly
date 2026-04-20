"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { RegisterWizard } from "@/components/features/auth/RegisterWizard";

export default function RegisterPage() {
  return (
    <AuthGuard publicOnly>
      <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          <RegisterWizard />
        </div>
      </div>
    </AuthGuard>
  );
}
