import {
  addRole,
  changeEmail,
  changePassword,
  changeUnconfirmedEmail,
  confirmEmailChange,
  updateProfile,
} from "@/api/UsersAPI";
import { useAuth } from "@/hooks/stores/useAuth";
import { userKeys } from "@/lib/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * @description Hook para actualizar la información básica del usuario.
 * Sincroniza la caché de React Query y el store de Zustand simultáneamente.
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      toast.success("Perfil actualizado", {
        description: "Tus cambios se han guardado correctamente.",
      });

      // Actualizamos el estado global (Zustand)
      setUser(data);

      // Actualizamos la caché de React Query mediante Pessimistic Update
      queryClient.setQueryData(userKeys.me(), data);
    },
    onError: (error: Error) => {
      toast.error("Error al actualizar", {
        description:
          error.message ||
          "No se pudieron guardar los cambios. Inténtalo de nuevo.",
      });
    },
  });
}

/**
 * @description Hook para cambiar la contraseña del usuario.
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Seguridad actualizada", {
        description: "Tu contraseña ha sido cambiada exitosamente.",
      });
    },
    onError: (error: Error) => {
      toast.error("Error de validación", {
        description:
          error.message ||
          "La contraseña actual es incorrecta o no cumple los requisitos.",
      });
    },
  });
}

/**
 * @description Hook para iniciar el cambio de correo electrónico de una cuenta confirmada.
 */
export function useChangeEmail() {
  return useMutation({
    mutationFn: changeEmail,
    onSuccess: () => {
      toast.success(
        "Te hemos enviado un enlace de confirmación al nuevo correo.",
      );
    },
    onError: (error: Error) => {
      toast.error("Error", {
        description: error.message || "Error al solicitar el cambio de correo.",
      });
    },
  });
}

/**
 * @description Hook para cambiar el correo de una cuenta que aún no ha sido confirmada.
 */
export function useChangeUnconfirmedEmail() {
  return useMutation({
    mutationFn: changeUnconfirmedEmail,
    onSuccess: () => {
      toast.success("Correo actualizado", {
        description: "Revisa tu bandeja para confirmarlo.",
      });
    },
    onError: (error: Error) => {
      toast.error("Error", {
        description: error.message || "No se pudo cambiar el correo.",
      });
    },
  });
}

/**
 * @description Hook para confirmar definitivamente un cambio de correo electrónico.
 */
export function useConfirmEmailChange() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, token }: { email: string; token: string }) =>
      confirmEmailChange(email, token),
    onSuccess: () => {
      toast.success("¡Tu nuevo correo ha sido confirmado con éxito!");
      // Invalidamos el perfil para forzar a traer el nuevo email de la base de datos
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "El token es inválido o expiró.");
    },
  });
}

/**
 * @description Hook para añadir un rol (ej. Host) al usuario.
 * Al recibir un nuevo JWT desde el backend, reemplaza la sesión activa por completo.
 */
export function useAddRole() {
  const queryClient = useQueryClient();
  const { setAuth } = useAuth();

  return useMutation({
    mutationFn: addRole,
    onSuccess: (data) => {
      toast.success(
        "¡Felicidades! Ahora tienes acceso a las funciones de Anfitrión.",
      );

      const { token, ...userProfile } = data;

      // data incluye el nuevo JWT (token) y el perfil actualizado
      setAuth(token, userProfile);

      // Actualizamos la caché también para mantener congruencia
      queryClient.setQueryData(userKeys.me(), userProfile);
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Ocurrió un problema al procesar tu solicitud.",
      );
    },
  });
}
