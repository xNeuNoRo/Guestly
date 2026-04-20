"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { ForgotPasswordForm } from "@/components/features/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthGuard publicOnly>
      <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-md">
          <ForgotPasswordForm />
        </div>
      </div>
    </AuthGuard>
  );
}