"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoHourglassOutline,
  IoArrowForwardOutline,
} from "react-icons/io5";

import { Button } from "@/components/shared/Button";
import { useConfirmEmail } from "@/hooks/auth/useMutation";
import { ROUTES } from "@/constants/routes";

/**
 * @description Página de aterrizaje para la confirmación de cuenta.
 * Procesa automáticamente el token de validación al cargar.
 */
export default function ConfirmEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const { mutate, isPending, isSuccess, isError, error } = useConfirmEmail();

  useEffect(() => {
    if (token && email) {
      mutate({ token, email });
    }
  }, [token, email, mutate]);

  // --- ESCENARIO 1: CARGANDO / PROCESANDO ---
  if (isPending || !token || !email) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center animate-pulse mb-6">
          <IoHourglassOutline
            className="text-primary-600 animate-spin"
            size={40}
          />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Verificando tu cuenta
        </h2>
        <p className="text-slate-500 mt-2">
          Estamos validando tu enlace, un momento por favor...
        </p>
      </div>
    );
  }

  // --- ESCENARIO 2: ÉXITO ---
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <IoCheckmarkCircleOutline className="text-green-600" size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          ¡Cuenta confirmada!
        </h2>
        <p className="text-slate-600 mt-4 max-w-md mx-auto">
          Tu correo ha sido verificado con éxito. Ya puedes disfrutar de todas
          las funcionalidades de Guestly.
        </p>
        <div className="mt-10">
          <Button
            onClick={() => router.push(ROUTES.AUTH.LOGIN)}
            className="px-8 py-4 text-base shadow-lg shadow-primary-500/20"
            rightIcon={<IoArrowForwardOutline />}
          >
            Ir al inicio de sesión
          </Button>
        </div>
      </div>
    );
  }

  // --- ESCENARIO 3: ERROR ---
  if (isError || !token || !email) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <IoCloseCircleOutline className="text-red-600" size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Enlace inválido o expirado
        </h2>
        <p className="text-slate-600 mt-2 max-w-sm mx-auto">
          {error?.message ||
            "Hubo un problema al confirmar tu cuenta. Por favor, solicita un nuevo enlace desde el registro."}
        </p>
        <div className="mt-8 flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push(ROUTES.AUTH.REGISTER)}
          >
            Volver al registro
          </Button>
          <Button onClick={() => router.push(ROUTES.PUBLIC.HOME)}>
            Ir al inicio
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
