"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoShieldCheckmarkOutline,
  IoMailOpenOutline,
  IoArrowForwardOutline,
  IoArrowBackOutline,
  IoCreateOutline,
} from "react-icons/io5";
import { toast } from "sonner";

import { Form } from "@/components/shared/form/Form";
import { InputField } from "@/components/shared/form/InputField";
import { Button } from "@/components/shared/Button";

import { useQueryString } from "@/hooks/shared/useQueryString";
import {
  useChangeEmail,
  useChangeUnconfirmedEmail,
} from "@/hooks/users/useMutation";
import {
  changeEmailSchema,
  changeUnconfirmedEmailSchema,
  type ChangeEmailRequest,
} from "@/schemas/users.schemas";

interface ChangeEmailWizardProps {
  isConfirmedMode?: boolean;
  onSuccess?: (newEmail: string) => void;
}

type ChangeEmailWizardFormData = {
  newEmail: string;
  password?: string;
};

export function ChangeEmailWizard({
  isConfirmedMode = true,
  onSuccess,
}: Readonly<ChangeEmailWizardProps>) {
  const router = useRouter();
  const { createUrl, searchParams } = useQueryString();

  const currentStep = Number(searchParams.get("wizardStep")) || 1;
  const newEmailValue = searchParams.get("newEmail") || "";

  const [direction, setDirection] = useState(0);

  const maxSteps = isConfirmedMode ? 3 : 2;

  const { mutate: changeEmail, isPending: isChanging } = useChangeEmail();
  const { mutate: resendUnconfirmed, isPending: isChangingUnconfirmed } =
    useChangeUnconfirmedEmail();

  const form = useForm<ChangeEmailWizardFormData>({
    resolver: zodResolver(
      isConfirmedMode ? changeEmailSchema : changeUnconfirmedEmailSchema,
    ) as Resolver<ChangeEmailWizardFormData>,
    defaultValues: { newEmail: "", password: "" },
  });

  const nextStep = () => {
    setDirection(1);
    router.push(createUrl({ wizardStep: currentStep + 1 }), { scroll: false });
  };

  const handleSecurityNext = async () => {
    const isValid = await form.trigger("password");
    if (isValid) nextStep();
  };

  const prevStep = () => {
    setDirection(-1);
    router.push(createUrl({ wizardStep: currentStep - 1 }), { scroll: false });
  };

  const onSubmit = (data: ChangeEmailWizardFormData) => {
    const commonOnSuccess = () => {
      setDirection(1);
      router.push(
        createUrl({ wizardStep: currentStep + 1, newEmail: data.newEmail }),
        { scroll: false },
      );
      onSuccess?.(data.newEmail);
    };

    if (isConfirmedMode) {
      const payload: ChangeEmailRequest = {
        newEmail: data.newEmail,
        password: data.password ?? "",
      };

      changeEmail(payload, {
        onSuccess: commonOnSuccess,
        onError: () =>
          toast.error("Error", {
            description: "Contraseña incorrecta o email ya en uso.",
          }),
      });
    } else {
      resendUnconfirmed(
        { newEmail: data.newEmail },
        {
          onSuccess: commonOnSuccess,
          onError: () =>
            toast.error("Error", {
              description:
                "No se pudo cambiar el correo. Verifica que no esté en uso.",
            }),
        },
      );
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 50 : -50, opacity: 0 }),
  };

  return (
    <div className="w-full overflow-hidden relative min-h-87.5 flex flex-col justify-center">
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        {/* PASO 1: SEGURIDAD (Solo modo confirmado) */}
        {isConfirmedMode && currentStep === 1 && (
          <motion.div
            key="verify"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
                <IoShieldCheckmarkOutline size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Verifica tu identidad
              </h3>
              <p className="text-sm text-slate-500 mt-1 px-4">
                Necesitamos tu contraseña para autorizar el cambio.
              </p>
            </div>
            {/* Cambiamos onSubmit para validar antes de saltar */}
            <Form form={form} onSubmit={handleSecurityNext}>
              <InputField
                name="password"
                label="Contraseña actual"
                type="password"
              />
              <Button
                type="submit"
                className="w-full mt-4"
                rightIcon={<IoArrowForwardOutline />}
              >
                Continuar
              </Button>
            </Form>
          </motion.div>
        )}

        {/* PASO EMAIL: Paso 2 (Confirmado) o Paso 1 (Unconfirmed) */}
        {((isConfirmedMode && currentStep === 2) ||
          (!isConfirmedMode && currentStep === 1)) && (
          <motion.div
            key="email-input"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                <IoCreateOutline size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {isConfirmedMode ? "Nuevo correo" : "Corregir correo"}
              </h3>
              <p className="text-sm text-slate-500 mt-1 px-4">
                {isConfirmedMode
                  ? "¿Cuál será tu nueva dirección?"
                  : "Escribe la dirección correcta para enviarte el código."}
              </p>
            </div>
            <Form form={form} onSubmit={onSubmit} className="space-y-4">
              <InputField
                name="newEmail"
                label="Correo electrónico"
                type="email"
                placeholder="tucorreo@ejemplo.com"
              />
              <div className="flex gap-2">
                {isConfirmedMode && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={prevStep}
                    leftIcon={<IoArrowBackOutline />}
                  >
                    Atrás
                  </Button>
                )}
                <Button
                  type="submit"
                  className="flex-1"
                  isLoading={isChanging || isChangingUnconfirmed}
                >
                  Confirmar cambio
                </Button>
              </div>
            </Form>
          </motion.div>
        )}

        {/* PASO ÉXITO */}
        {currentStep === maxSteps && (
          <motion.div
            key="success"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="text-center space-y-6"
          >
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <IoMailOpenOutline size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                ¡Correo actualizado!
              </h3>
              <p className="text-sm text-slate-600 px-4">
                Hemos enviado un nuevo enlace a:
                <br />
                <span className="font-bold text-slate-900">
                  {newEmailValue}
                </span>
              </p>
            </div>
            {!isConfirmedMode && (
              <p className="text-xs text-slate-400">
                Ahora puedes cerrar esta ventana y revisar tu bandeja.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
