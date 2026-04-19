import { handleApiError } from "@/helpers/handleApiError";
import { validateApiRes } from "@/helpers/validateApiRes";
import { api } from "@/lib/axios";
import {
  type LoginRequest,
  type RegisterRequest,
  type AuthResponse,
  type ResendConfirmationEmailRequest,
  type ForgotPasswordRequest,
  type ResetPasswordRequest,
  authResponseSchema,
} from "@/schemas/auth.schemas";

/**
 * @description Función para registrar un nuevo usuario. Envía una solicitud
 * POST a la API con los datos de registro y devuelve la respuesta validada.
 * @param request - Objeto que contiene los datos necesarios para el registro (nombre, apellido, email, contraseña y rol).
 * @returns Un objeto AuthResponse que contiene los detalles del usuario registrado, incluyendo un token de autenticación.
 */
export const register = async (
  request: RegisterRequest,
): Promise<AuthResponse> => {
  try {
    const { data } = await api.post("/auth/register", request);
    return validateApiRes(data, authResponseSchema);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Función para iniciar sesión. Envía una solicitud POST a la API
 * con las credenciales del usuario y devuelve la respuesta validada.
 * @param request - Objeto que contiene el email y la contraseña del usuario.
 * @returns Un objeto AuthResponse que contiene los detalles del usuario autenticado, incluyendo un token de autenticación.
 */
export const login = async (request: LoginRequest): Promise<AuthResponse> => {
  try {
    const { data } = await api.post("/auth/login", request);
    return validateApiRes(data, authResponseSchema);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Función para confirmar el correo electrónico de un usuario. Envía una
 * solicitud POST a la API con el email y el token de confirmación. No devuelve datos, pero puede lanzar errores si la confirmación falla.
 * @param email - El correo electrónico del usuario que se está confirmando.
 * @param token - El token de confirmación que se envió al correo del usuario.
 */
export const confirmEmail = async (
  email: string,
  token: string,
): Promise<void> => {
  try {
    const params = new URLSearchParams({ email, token });
    await api.post(`/auth/confirm-email?${params.toString()}`);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Función para reenviar el correo de confirmación. Envía una solicitud POST
 * a la API con el email del usuario para que se le reenvíe el correo de confirmación.
 * No devuelve datos, pero puede lanzar errores si el proceso falla.
 * @param request - Objeto que contiene el email del usuario al que se le debe reenviar el correo de confirmación.
 */
export const resendConfirmation = async (
  request: ResendConfirmationEmailRequest,
): Promise<void> => {
  try {
    await api.post("/auth/resend-confirmation", request);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Función para solicitar el restablecimiento de contraseña. Envía una
 * solicitud POST a la API con el email del usuario para que se le envíe un correo
 * con instrucciones para restablecer su contraseña. No devuelve datos, pero puede lanzar errores si el proceso falla.
 * @param request - Objeto que contiene el email del usuario que ha olvidado su contraseña y necesita restablecerla.
 */
export const forgotPassword = async (
  request: ForgotPasswordRequest,
): Promise<void> => {
  try {
    await api.post("/auth/forgot-password", request);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Función para restablecer la contraseña de un usuario. Envía una
 * solicitud POST a la API con el email del usuario, el token de seguridad recibido
 * por correo y la nueva contraseña. No devuelve datos, pero puede lanzar errores si el proceso falla.
 * @param request - Objeto que contiene el email del usuario, el token de seguridad y la nueva contraseña.
 */
export const resetPassword = async (
  request: ResetPasswordRequest,
): Promise<void> => {
  try {
    await api.post("/auth/reset-password", request);
  } catch (error) {
    handleApiError(error);
  }
};
