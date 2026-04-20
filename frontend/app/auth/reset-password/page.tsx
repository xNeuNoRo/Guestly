"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { ResetPasswordForm } from "@/components/features/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthGuard publicOnly>
      <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-md">
          <ResetPasswordForm />
        </div>
      </div>
    </AuthGuard>
  );
}