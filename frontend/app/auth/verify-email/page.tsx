"use client";

import { useRouter } from "next/navigation";
import {
  IoMailOpenOutline,
  IoRefreshOutline,
  IoCreateOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import { toast } from "sonner";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";
import { ChangeEmailWizard } from "@/components/features/users/ChangeEmailWizard";

import { useAuth } from "@/hooks/stores/useAuth";
import { useResendConfirmation } from "@/hooks/auth/useMutation";
import { useQueryString } from "@/hooks/shared/useQueryString";
import { ROUTES } from "@/constants/routes";

/**
 * @description Sala de espera para usuarios autenticados pero no confirmados.
 * Utiliza AuthGuard para asegurar que el usuario esté logueado, pero sin exigir confirmación.
 */
export function VerifyEmailPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { createUrl, searchParams } = useQueryString();
  const { mutate: resend, isPending: isResending } = useResendConfirmation();

  // Si por alguna razón un usuario YA confirmado entra aquí, lo mandamos al Home
  if (user?.isEmailConfirmed) {
    router.replace(ROUTES.PUBLIC.HOME);
    return null;
  }

  const handleResend = () => {
    if (!user?.email) return;
    resend({ email: user.email });
  };

  const isModalOpen = searchParams.get("modal") === "fix-email";

  return (
    <AuthGuard requireEmailConfirmed={false}>
      <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-8 md:p-12 text-center">
          <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <IoMailOpenOutline className="text-primary-600" size={48} />
          </div>

          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Verifica tu correo
          </h1>

          <p className="text-slate-600 mt-4 leading-relaxed">
            ¡Casi listo! Hemos enviado un enlace de confirmación a: <br />
            <span className="font-bold text-slate-900">{user?.email}</span>
          </p>

          <div className="mt-10 space-y-3">
            <Button
              onClick={handleResend}
              isLoading={isResending}
              className="w-full py-4 shadow-lg shadow-primary-500/20"
              leftIcon={!isResending && <IoRefreshOutline size={20} />}
            >
              Reenviar enlace
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push(createUrl({ modal: "fix-email" }))}
              className="w-full py-4"
              leftIcon={<IoCreateOutline size={20} />}
            >
              Corregir correo electrónico
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100">
            <button
              onClick={() => {
                logout();
                router.push(ROUTES.AUTH.LOGIN);
              }}
              className="flex p-4 rounded-full items-center justify-center gap-2 mx-auto text-sm font-bold text-slate-400 hover:cursor-pointer hover:bg-red-500 hover:text-white transition-colors duration-300"
            >
              <IoLogOutOutline size={18} />
              Cerrar sesión e intentar con otra cuenta
            </button>
          </div>
        </div>
      </div>

      {/* Reutilizamos el Wizard de cambio de email en modo "No confirmado" */}
      <Modal
        open={isModalOpen}
        close={() => router.push(createUrl({ modal: null }))}
        title="Corregir correo electrónico"
      >
        <ChangeEmailWizard
          isConfirmedMode={false}
          onSuccess={() => router.push(createUrl({ modal: null }))}
        />
      </Modal>
    </AuthGuard>
  );
}

export default VerifyEmailPage;
