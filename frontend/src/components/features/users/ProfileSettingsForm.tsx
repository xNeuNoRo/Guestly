"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoPersonOutline, IoSaveOutline } from "react-icons/io5";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { Form } from "@/components/shared/form/Form";
import { InputField } from "@/components/shared/form/InputField";
import { Button } from "@/components/shared/Button";
import { Skeleton } from "@/components/shared/Skeleton";

import { useMyProfile } from "@/hooks/users/useQueries";
import { useUpdateProfile } from "@/hooks/users/useMutation";
import {
  updateUserProfileSchema,
  type UpdateUserProfileRequest,
} from "@/schemas/users.schemas";

/**
 * @description Formulario para actualizar la información básica del perfil.
 * Carga los datos actuales del usuario y permite editarlos con validación en tiempo real.
 */
export function ProfileSettingsForm() {
  // Obtenemos los datos actuales del perfil
  const { data: profile, isLoading: isFetching } = useMyProfile();

  // Hook de mutación para guardar cambios
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const form = useForm<UpdateUserProfileRequest>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  // 3. Efecto para resetear el formulario cuando los datos del perfil lleguen del servidor
  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
      });
    }
  }, [profile, form]);

  const onSubmit = (data: UpdateUserProfileRequest) => {
    updateProfile(data, {
      onSuccess: (updatedUser) => {
        toast.success("Perfil actualizado", {
          description: "Tus cambios se han guardado correctamente.",
        });
        form.reset({
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
        });
      },
      onError: (error) => {
        toast.error("Error al actualizar", {
          description:
            "No se pudieron guardar los cambios. Inténtalo de nuevo.",
        });
        console.error(error);
      },
    });
  };

  // Renderizado del estado de carga inicial
  if (isFetching) {
    return (
      <div className="space-y-6 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <Skeleton className="h-12 w-32 rounded-xl ml-auto" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="p-8 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
            <IoPersonOutline size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Información Personal
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          Actualiza tu nombre público. Esto es lo que otros usuarios verán en la
          plataforma.
        </p>
      </div>

      <Form form={form} onSubmit={onSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField name="firstName" label="Nombre" placeholder="Tu nombre" />
          <InputField
            name="lastName"
            label="Apellido"
            placeholder="Tu apellido"
          />
        </div>

        {/* Información de solo lectura (Email) */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Correo electrónico
          </p>
          <p className="text-sm font-medium text-slate-600">{profile?.email}</p>
          <p className="text-[10px] text-slate-400 mt-2">
            El correo electrónico se gestiona en la sección de seguridad.
          </p>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            isLoading={isUpdating}
            disabled={!form.formState.isDirty} // Solo habilitar si hubo cambios
            leftIcon={<IoSaveOutline size={18} />}
            className="w-full md:w-auto px-8"
          >
            Guardar cambios
          </Button>
        </div>
      </Form>
    </motion.div>
  );
}
