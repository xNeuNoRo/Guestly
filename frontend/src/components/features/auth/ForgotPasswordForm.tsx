"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IoMailOutline,
  IoArrowBackOutline,
  IoPaperPlaneOutline,
} from "react-icons/io5";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { Form } from "@/components/shared/form/Form";
import { InputField } from "@/components/shared/form/InputField";
import { Button } from "@/components/shared/Button";

import { useQueryString } from "@/hooks/shared/useQueryString";
import { useForgotPassword } from "@/hooks/auth/useMutation";
import {
  forgotPasswordSchema,
  type ForgotPasswordRequest,
} from "@/schemas/auth.schemas";
import { ROUTES } from "@/constants/routes";

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 50 : -50, opacity: 0 }),
};

/**
 * @description Formulario para solicitar el enlace de recuperación de contraseña.
 * Utiliza la URL para persistir el paso actual y el correo de confirmación.
 */
export function ForgotPasswordForm() {
  const router = useRouter();
  const { createUrl, searchParams } = useQueryString();

  // --- Fuente de Verdad: URL ---
  const currentStep = Number(searchParams.get("step")) || 1;
  const submittedEmail = searchParams.get("email") || "";

  // Estado local solo para la dirección de la animación visual
  const [direction, setDirection] = useState(0);

  const { mutate: requestReset, isPending } = useForgotPassword();

  const form = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: ForgotPasswordRequest) => {
    requestReset(data, {
      onSuccess: () => {
        setDirection(1);
        router.push(createUrl({ step: 2, email: data.email }), {
          scroll: false,
        });
      },
      onError: () => {
        toast.error("Error al procesar la solicitud", {
          description: "Inténtalo de nuevo más tarde.",
        });
      },
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        {/* --- PASO 1: FORMULARIO DE SOLICITUD --- */}
        {currentStep === 1 && (
          <motion.div
            key="forgot-password-form"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="p-8"
          >
            <div className="mb-6 text-center">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <IoMailOutline className="text-primary-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                ¿Olvidaste tu contraseña?
              </h2>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                Ingresa el correo asociado a tu cuenta y te enviaremos
                instrucciones para restablecerla.
              </p>
            </div>

            <Form form={form} onSubmit={onSubmit} className="space-y-6">
              <InputField
                name="email"
                label="Correo electrónico"
                type="email"
                placeholder="juan@ejemplo.com"
              />

              <Button
                type="submit"
                className="w-full py-4"
                isLoading={isPending}
                leftIcon={!isPending && <IoPaperPlaneOutline />}
              >
                Enviar enlace de recuperación
              </Button>
            </Form>

            <div className="mt-6 text-center">
              <Link
                href={ROUTES.AUTH.LOGIN}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                <IoArrowBackOutline /> Volver al inicio de sesión
              </Link>
            </div>
          </motion.div>
        )}

        {/* --- PASO 2: PANTALLA DE ÉXITO --- */}
        {currentStep === 2 && (
          <motion.div
            key="forgot-password-success"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="p-8 text-center space-y-6"
          >
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <IoPaperPlaneOutline className="text-emerald-600" size={40} />
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              Revisa tu correo
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              Si el correo{" "}
              <span className="font-bold text-slate-900">{submittedEmail}</span>{" "}
              está registrado en Guestly, recibirás un enlace para restablecer
              tu contraseña en los próximos minutos.
            </p>

            <div className="pt-6 border-t border-slate-100">
              <p className="text-xs text-slate-500 mb-4">
                ¿No lo recibiste? Revisa tu carpeta de Spam.
              </p>
              <Link href={ROUTES.AUTH.LOGIN} className="block w-full">
                <Button
                  variant="outline"
                  className="w-full"
                  leftIcon={<IoArrowBackOutline />}
                >
                  Volver al inicio de sesión
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
