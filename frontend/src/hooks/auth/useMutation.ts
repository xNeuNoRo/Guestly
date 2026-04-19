import {
  confirmEmail,
  forgotPassword,
  login,
  register,
  resendConfirmation,
  resetPassword,
} from "@/api/AuthAPI";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "../stores/useAuth";

/**
 * @description Hook para registrar un nuevo usuario. Utiliza React Query para manejar la mutación y Zustand para guardar la sesión.
 * @returns Mutación para ejecutar el registro de cuenta.
 */
export function useRegister() {
  const { setAuth } = useAuth();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      // Guardamos el token y el perfil en el estado global
      setAuth(data.token, data);
      toast.success("Cuenta creada exitosamente. ¡Bienvenido!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al intentar registrar la cuenta.");
    },
  });
}

/**
 * @description Hook para iniciar sesión. Guarda el token y los datos del usuario en el store global en caso de éxito.
 * @returns Mutación para ejecutar el inicio de sesión.
 */
export function useLogin() {
  const { setAuth } = useAuth();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Guardamos el token y el perfil en el estado global
      setAuth(data.token, data);
      toast.success("Inicio de sesión exitoso.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Credenciales incorrectas o error de conexión.");
    },
  });
}

/**
 * @description Hook para confirmar el correo electrónico de un usuario usando su email y token.
 * @returns Mutación para confirmar la cuenta.
 */
export function useConfirmEmail() {
  return useMutation({
    // La mutación recibe un objeto, así que lo mapeamos a los parámetros posicionales que espera la API
    mutationFn: ({ email, token }: { email: string; token: string }) =>
      confirmEmail(email, token),
    onSuccess: () => {
      toast.success("Correo confirmado exitosamente. Ya puedes iniciar sesión.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "El enlace es inválido o ha expirado.");
    },
  });
}

/**
 * @description Hook para reenviar el correo de confirmación de cuenta.
 * @returns Mutación para solicitar un nuevo correo.
 */
export function useResendConfirmation() {
  return useMutation({
    mutationFn: resendConfirmation,
    onSuccess: () => {
      toast.success("Si el correo está registrado, recibirás un nuevo enlace de confirmación.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al reenviar el correo.");
    },
  });
}

/**
 * @description Hook para solicitar la recuperación de contraseña enviando un correo con el token de restablecimiento.
 * @returns Mutación para solicitar la recuperación.
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("Se han enviado las instrucciones a tu correo electrónico.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "No se pudo procesar la solicitud.");
    },
  });
}

/**
 * @description Hook para establecer una nueva contraseña utilizando el token enviado por correo.
 * @returns Mutación para restablecer la contraseña.
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Contraseña actualizada correctamente. Ya puedes iniciar sesión con tu nueva clave.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "El token es inválido o ha expirado.");
    },
  });
}