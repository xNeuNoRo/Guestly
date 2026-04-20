"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoKeyOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { Form } from "@/components/shared/form/Form";
import { InputField } from "@/components/shared/form/InputField";
import { Button } from "@/components/shared/Button";

import { useChangePassword } from "@/hooks/users/useMutation";
import {
  changePasswordSchema,
  type ChangePasswordRequest,
} from "@/schemas/users.schemas";

/**
 * @description Formulario de seguridad para el cambio de contraseña.
 * Requiere la contraseña actual para validar la identidad del usuario.
 */
export function ChangePasswordForm() {
  const { mutate: changePassword, isPending } = useChangePassword();

  const form = useForm<ChangePasswordRequest>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordRequest) => {
    // Verificación de seguridad extra en el cliente por si el esquema no tiene el refine
    if (data.newPassword !== data.confirmNewPassword) {
      form.setError("confirmNewPassword", {
        message: "Las contraseñas no coinciden",
      });
      return;
    }

    changePassword(data, {
      onSuccess: () => {
        form.reset(); // Limpiamos campos sensibles tras el éxito
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="p-8 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
            <IoShieldCheckmarkOutline size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Seguridad de la Cuenta
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          Cambia tu contraseña regularmente para mantener tu cuenta protegida.
        </p>
      </div>

      <Form form={form} onSubmit={onSubmit} className="p-8 space-y-6">
        <div className="flex flex-col gap-5">
          {/* Contraseña Actual */}
          <InputField
            name="currentPassword"
            label="Contraseña Actual"
            type="password"
            placeholder="••••••••"
          />

          <hr className="border-slate-100" />

          {/* Nueva Contraseña */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              name="newPassword"
              label="Nueva Contraseña"
              type="password"
              placeholder="Mínimo 8 caracteres"
            />
            <InputField
              name="confirmNewPassword"
              label="Confirmar Nueva Contraseña"
              type="password"
              placeholder="Repite tu contraseña"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            isLoading={isPending}
            leftIcon={<IoKeyOutline size={18} />}
            className="w-full md:w-auto px-8 bg-slate-900 hover:bg-slate-800"
          >
            Actualizar contraseña
          </Button>
        </div>
      </Form>
    </motion.div>
  );
}
