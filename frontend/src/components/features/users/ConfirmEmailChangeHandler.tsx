"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoReloadOutline,
  IoArrowForwardOutline,
} from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/shared/Button";
import { useConfirmEmailChange } from "@/hooks/users/useMutation";
import { ROUTES } from "@/constants/routes";

/**
 * @description Manejador visual para la confirmación del cambio de email.
 * Procesa automáticamente el token y el email de la URL al montar el componente.
 */
export function ConfirmEmailChangeHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasCalled = useRef(false);

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const { mutate, isPending, isSuccess, isError, error } =
    useConfirmEmailChange();

  useEffect(() => {
    // Evitamos ejecuciones duplicadas en StrictMode de React
    if (email && token && !hasCalled.current) {
      hasCalled.current = true;
      mutate({ email, token });
    }
  }, [email, token, mutate]);

  const handleGoToLogin = () => {
    router.push(ROUTES.AUTH.LOGIN);
  };

  if (!email || !token) {
    return (
      <div className="min-h-100 w-full flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <IoCloseCircleOutline size={48} className="mx-auto text-slate-300" />
          <p className="text-slate-500 font-medium">
            Enlace inválido o incompleto.
          </p>
          <Button onClick={handleGoToLogin} variant="ghost">
            Volver a iniciar sesión para solicitar un nuevo cambio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-100 w-full flex items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {/* ESTADO: PROCESANDO */}
        {isPending && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center space-y-6"
          >
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 border-4 border-primary-100 rounded-full" />
              <motion.div
                className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-primary-600">
                <IoReloadOutline size={32} />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">
                Verificando cambios
              </h2>
              <p className="text-slate-500">
                Estamos validando tu nueva dirección de correo...
              </p>
            </div>
          </motion.div>
        )}

        {/* ESTADO: ÉXITO */}
        {isSuccess && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-10 shadow-xl text-center space-y-8"
          >
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <IoCheckmarkCircleOutline size={48} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">
                ¡Correo confirmado!
              </h2>
              <p className="text-slate-600">
                Tu dirección ha sido actualizada a{" "}
                <span className="font-bold text-slate-900">{email}</span>{" "}
                correctamente. Por seguridad, inicia sesión nuevamente.
              </p>
            </div>
            <Button
              onClick={handleGoToLogin}
              className="w-full h-12 rounded-2xl"
              rightIcon={<IoArrowForwardOutline />}
            >
              Iniciar sesión
            </Button>
          </motion.div>
        )}

        {/* ESTADO: ERROR */}
        {isError && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white rounded-3xl border border-red-100 p-10 shadow-xl text-center space-y-8"
          >
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <IoCloseCircleOutline size={48} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">
                Enlace inválido
              </h2>
              <p className="text-slate-600">
                {error?.message ||
                  "El token ha expirado o ya ha sido utilizado."}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                variant="ghost"
                onClick={handleGoToLogin}
                className="w-full"
              >
                Volver a iniciar sesión para solicitar un nuevo cambio
              </Button>
              <p className="text-xs text-slate-400">
                Si el problema persiste, solicita un nuevo cambio desde tu
                configuración.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
