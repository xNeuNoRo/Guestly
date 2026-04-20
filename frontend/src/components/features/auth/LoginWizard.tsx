"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IoLogInOutline,
  IoMailOpenOutline,
  IoArrowBackOutline,
} from "react-icons/io5";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { Form } from "@/components/shared/form/Form";
import { InputField } from "@/components/shared/form/InputField";
import { Button } from "@/components/shared/Button";

import { useQueryString } from "@/hooks/shared/useQueryString";
import { useLogin, useResendConfirmation } from "@/hooks/auth/useMutation";
import { loginSchema, type LoginRequest } from "@/schemas/auth.schemas";
import { ROUTES } from "@/constants/routes";

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

export function LoginWizard() {
  const router = useRouter();
  const { createUrl, searchParams } = useQueryString();

  // --- Fuente de Verdad: URL ---
  const currentStep = Number(searchParams.get("step")) || 1;
  const unconfirmedEmail = searchParams.get("email") || "";

  // El estado de dirección es puramente visual para Framer Motion
  const [direction, setDirection] = useState(0);

  const { mutate: login, isPending: isLoggingIn } = useLogin();
  const { mutate: resendEmail, isPending: isResending } =
    useResendConfirmation();

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginRequest) => {
    login(data, {
      onSuccess: (authResponse) => {
        if (!authResponse.isEmailConfirmed) {
          setDirection(1);
          router.push(createUrl({ step: 2, email: authResponse.email }), {
            scroll: false,
          });
          return;
        }

        toast.success(`¡Bienvenido de vuelta, ${authResponse.firstName}!`);
        router.push(ROUTES.PUBLIC.HOME);
      },
    });
  };

  const handleResend = () => {
    if (!unconfirmedEmail) return;

    resendEmail({ email: unconfirmedEmail });
  };

  const handleBack = () => {
    setDirection(-1);
    router.push(createUrl({ step: 1, email: null }), { scroll: false });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        {currentStep === 1 && (
          <motion.div
            key="login-step"
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
                Iniciar Sesión
              </h2>
              <p className="text-slate-500 mt-2">
                Ingresa a tu cuenta para continuar.
              </p>
            </div>

            <Form form={form} onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-4">
                <InputField
                  name="email"
                  label="Correo electrónico"
                  type="email"
                  placeholder="juan@ejemplo.com"
                />

                <div className="space-y-1">
                  <InputField
                    name="password"
                    label="Contraseña"
                    type="password"
                    placeholder="••••••••"
                  />
                  <div className="flex justify-end">
                    <Link
                      href={ROUTES.AUTH.FORGOT_PASSWORD}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline underline-offset-4 transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-4 text-base mt-2"
                isLoading={isLoggingIn}
                leftIcon={!isLoggingIn && <IoLogInOutline size={20} />}
              >
                Entrar a mi cuenta
              </Button>
            </Form>

            <div className="mt-8 text-center border-t border-slate-100 pt-6">
              <p className="text-sm text-slate-600">
                ¿Aún no tienes una cuenta?{" "}
                <Link
                  href={ROUTES.AUTH.REGISTER}
                  className="font-bold text-primary-600 hover:text-primary-700 hover:underline underline-offset-4 transition-colors"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="unconfirmed-step"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="p-8 text-center space-y-6"
          >
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <IoMailOpenOutline className="text-amber-600" size={40} />
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              Confirma tu cuenta
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Para continuar, debes confirmar tu correo: <br />
              <span className="font-bold text-slate-900">
                {unconfirmedEmail}
              </span>
              .
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
                onClick={handleBack}
                leftIcon={<IoArrowBackOutline />}
                className="w-full text-slate-500 hover:text-slate-700"
              >
                Volver al inicio de sesión
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
