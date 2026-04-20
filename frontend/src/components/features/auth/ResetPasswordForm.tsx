"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoLockClosedOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { toast } from "sonner";

import { Form } from "@/components/shared/form/Form";
import { InputField } from "@/components/shared/form/InputField";
import { Button } from "@/components/shared/Button";

import { useQueryString } from "@/hooks/shared/useQueryString";
import { useResetPassword } from "@/hooks/auth/useMutation";
import {
  resetPasswordSchema,
  type ResetPasswordRequest,
} from "@/schemas/auth.schemas";
import { ROUTES } from "@/constants/routes";

/**
 * @description Formulario para establecer una nueva contraseña.
 * Utiliza la URL para persistir el estado de éxito de la operación.
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const { createUrl, searchParams } = useQueryString();
  const { mutate: resetPassword, isPending } = useResetPassword();

  // --- Fuente de Verdad: URL ---
  const isSuccess = searchParams.get("status") === "success";
  const emailParam = searchParams.get("email");
  const tokenParam = searchParams.get("token");

  const form = useForm<ResetPasswordRequest>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailParam || "",
      token: tokenParam || "",
      newPassword: "",
    },
  });

  useEffect(() => {
    if (!emailParam || !tokenParam) {
      toast.error("Enlace inválido", {
        description:
          "El enlace de recuperación está incompleto o dañado. Por favor, solicita uno nuevo.",
      });
    }
  }, [emailParam, tokenParam]);

  const onSubmit = (data: ResetPasswordRequest) => {
    resetPassword(data, {
      onSuccess: () => {
        // Persistimos el éxito en la URL
        router.push(createUrl({ status: "success" }), { scroll: false });
      },
    });
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <IoCheckmarkCircleOutline className="text-emerald-600" size={40} />
        </div>

        <h2 className="text-2xl font-bold text-slate-900">¡Todo listo!</h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          Tu contraseña ha sido actualizada correctamente. Ya puedes acceder a
          tu cuenta de Guestly.
        </p>

        <div className="pt-6 border-t border-slate-100">
          <Button
            className="w-full"
            onClick={() => router.push(ROUTES.AUTH.LOGIN)}
          >
            Ir a iniciar sesión
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-3xl border border-slate-200 shadow-xl">
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <IoLockClosedOutline className="text-primary-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Nueva contraseña</h2>
        <p className="text-slate-500 mt-2 text-sm leading-relaxed">
          Ingresa tu nueva contraseña para la cuenta{" "}
          <span className="font-medium text-slate-700">{emailParam}</span>.
        </p>
      </div>

      <Form form={form} onSubmit={onSubmit} className="space-y-6">
        <input type="hidden" {...form.register("email")} />
        <input type="hidden" {...form.register("token")} />

        <InputField
          name="newPassword"
          label="Nueva contraseña"
          type="password"
          placeholder="Mínimo 8 caracteres"
        />

        <InputField
          name="confirmNewPassword"
          label="Confirmar nueva contraseña"
          type="password"
        />

        <Button
          type="submit"
          className="w-full py-4 mt-2"
          isLoading={isPending}
          disabled={!emailParam || !tokenParam}
        >
          Guardar contraseña
        </Button>
      </Form>
    </div>
  );
}
