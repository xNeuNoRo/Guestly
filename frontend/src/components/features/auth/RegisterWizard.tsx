"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  IoMailOpenOutline,
  IoPersonOutline,
  IoKeyOutline,
  IoHomeOutline,
  IoCheckmarkCircle,
  IoArrowForwardOutline,
} from "react-icons/io5";
import { toast } from "sonner";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

import { Form } from "@/components/shared/form/Form";
import { InputField } from "@/components/shared/form/InputField";
import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";
import { ChangeEmailWizard } from "@/components/features/users/ChangeEmailWizard";

import { useQueryString } from "@/hooks/shared/useQueryString";
import { useRegister, useResendConfirmation } from "@/hooks/auth/useMutation";
import { registerSchema, type RegisterRequest } from "@/schemas/auth.schemas";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0,
  }),
};

/**
 * @description Organismo de registro animado con persistencia en URL.
 * Mantiene la interfaz de navegación fluida pero con estado persistente.
 */
export function RegisterWizard() {
  const router = useRouter();
  const { createUrl, searchParams } = useQueryString();

  // --- Fuente de Verdad: URL (Purgados estados locales de negocio) ---
  const currentStep = Number(searchParams.get("step")) || 1;
  const registeredEmail = searchParams.get("email") || "";

  // Estado local SOLO para la dirección de la animación (permitido por ser UI volátil)
  const [direction, setDirection] = useState(0);

  const { mutate: register, isPending: isRegistering } = useRegister();
  const { mutate: resendEmail, isPending: isResending } =
    useResendConfirmation();

  const form = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "Guest",
    },
  });

  const selectedRole = form.watch("role");
  const currentFormEmail = form.watch("email");

  // --- Helpers Reconstruidos (Para no extrañar el useStep) ---
  const navigateToStep = (step: number, email?: string) => {
    setDirection(step > currentStep ? 1 : -1);
    router.push(createUrl({ step, email: email ?? registeredEmail }), {
      scroll: false,
    });
  };

  const onSubmit = (data: RegisterRequest) => {
    register(data, {
      onSuccess: () => {
        navigateToStep(2, data.email);
      },
    });
  };

  const handleResend = () => {
    if (!registeredEmail) return;

    resendEmail({ email: registeredEmail, flow: "registration" });
  };

  const isFixEmailModalOpen = searchParams.get("modal") === "fix-email";

  // ARSENAL: Detectamos si el usuario ya se registró y si no ha modificado el email en el input
  const isAlreadyRegistered =
    Boolean(registeredEmail) && currentFormEmail === registeredEmail;

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        {/* --- PASO 1: FORMULARIO --- */}
        {currentStep === 1 && (
          <motion.div
            key="register-form-step"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="p-8"
          >
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900">
                Crea tu cuenta
              </h2>
              <p className="text-slate-500 mt-2">
                Únete a Guestly y empieza a explorar.
              </p>
            </div>

            <Form form={form} onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700">
                  ¿Cómo quieres usar Guestly?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      form.setValue("role", "Guest", { shouldValidate: true })
                    }
                    className={clsx(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all relative hover:cursor-pointer",
                      selectedRole === "Guest"
                        ? "border-primary-600 bg-primary-50 text-primary-700"
                        : "border-slate-200 bg-white hover:border-slate-300 text-slate-500",
                    )}
                  >
                    <IoPersonOutline size={24} />
                    <span className="font-medium text-sm">Quiero viajar</span>
                    {selectedRole === "Guest" && (
                      <IoCheckmarkCircle className="absolute top-2 right-2 text-primary-600" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      form.setValue("role", "Host", { shouldValidate: true })
                    }
                    className={clsx(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all relative hover:cursor-pointer",
                      selectedRole === "Host"
                        ? "border-primary-600 bg-primary-50 text-primary-700"
                        : "border-slate-200 bg-white hover:border-slate-300 text-slate-500",
                    )}
                  >
                    <IoHomeOutline size={24} />
                    <span className="font-medium text-sm">Quiero hospedar</span>
                    {selectedRole === "Host" && (
                      <IoCheckmarkCircle className="absolute top-2 right-2 text-primary-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  name="firstName"
                  label="Nombre"
                  placeholder="Juan"
                />
                <InputField
                  name="lastName"
                  label="Apellido"
                  placeholder="Pérez"
                />
              </div>

              <InputField
                name="email"
                label="Correo electrónico"
                type="email"
                placeholder="juan@ejemplo.com"
              />
              <InputField
                name="password"
                label="Contraseña"
                type="password"
                placeholder="Mínimo 8 caracteres"
              />

              {/* Lógica del botón inteligente */}
              {isAlreadyRegistered ? (
                <Button
                  type="button"
                  onClick={() => navigateToStep(2)}
                  className="w-full py-4 text-base mt-2"
                  variant="secondary"
                  rightIcon={<IoArrowForwardOutline />}
                >
                  Continuar a confirmación
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full py-4 text-base mt-2"
                  isLoading={isRegistering}
                  leftIcon={!isRegistering && <IoKeyOutline />}
                >
                  Crear cuenta
                </Button>
              )}
            </Form>
          </motion.div>
        )}

        {/* --- PASO 2: CONFIRMACIÓN --- */}
        {currentStep === 2 && (
          <motion.div
            key="register-success-step"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="p-8 text-center space-y-6"
          >
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <IoMailOpenOutline className="text-primary-600" size={40} />
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              Revisa tu correo
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Hemos enviado un enlace de confirmación a <br />
              <span className="font-bold text-slate-900">
                {registeredEmail}
              </span>
              .
            </p>
            <button
              onClick={() =>
                router.push(createUrl({ modal: "fix-email" }), {
                  scroll: false,
                })
              }
              className="text-sm font-medium text-primary-600 hover:underline hover:cursor-pointer transition-colors underline-offset-4"
            >
              ¿Escribiste mal tu correo? Corrígelo aquí
            </button>
            <p className="text-sm text-slate-500">
              Haz clic en el enlace para activar tu cuenta.
            </p>

            <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
              <Button
                variant="outline"
                onClick={handleResend}
                isLoading={isResending}
                className="w-full"
              >
                Reenviar correo
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigateToStep(1)}
                className="w-full text-slate-400"
              >
                Volver al formulario
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        open={isFixEmailModalOpen}
        close={() => router.push(createUrl({ modal: null }), { scroll: false })}
        title="Corregir correo"
        size="small"
      >
        <ChangeEmailWizard
          isConfirmedMode={false}
          onSuccess={(newEmail) => {
            // Sincronizamos el nuevo email en la URL y volvemos al paso 2
            router.push(createUrl({ modal: null, email: newEmail, step: 2 }), {
              scroll: false,
            });
            // Actualizamos el formulario para que el email coincida si vuelven al paso 1
            form.setValue("email", newEmail);
          }}
        />
      </Modal>
    </div>
  );
}
