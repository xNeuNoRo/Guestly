import { handleApiError } from "@/helpers/handleApiError";
import { validateApiRes } from "@/helpers/validateApiRes";
import { api } from "@/lib/axios";
import { type AuthResponse, authResponseSchema } from "@/schemas/auth.schemas";
import {
  type UpdateUserProfileRequest,
  type ChangePasswordRequest,
  type ChangeEmailRequest,
  type ChangeUnconfirmedEmailRequest,
  type AddRoleRequest,
  type UserProfileResponse,
  type PublicProfileResponse,
  type HostDashboardStatsResponse,
  userProfileResponseSchema,
  publicProfileResponseSchema,
  hostDashboardStatsResponseSchema,
} from "@/schemas/users.schemas";

/**
 * @description Obtiene el perfil completo y privado del usuario autenticado.
 * @returns Un objeto UserProfileResponse con la información detallada del usuario.
 */
export const getMyProfile = async (): Promise<UserProfileResponse> => {
  try {
    const { data } = await api.get("/users/me");
    return validateApiRes(data, userProfileResponseSchema);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Actualiza la información básica del perfil del usuario (nombre y apellido).
 * @param request - Objeto con el nuevo nombre y apellido.
 * @returns El perfil actualizado del usuario validado.
 */
export const updateProfile = async (
  request: UpdateUserProfileRequest,
): Promise<UserProfileResponse> => {
  try {
    const { data } = await api.put("/users/me", request);
    return validateApiRes(data, userProfileResponseSchema);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Cambia la contraseña del usuario autenticado verificando la actual.
 * @param request - Objeto con la contraseña actual y la nueva contraseña.
 */
export const changePassword = async (
  request: ChangePasswordRequest,
): Promise<void> => {
  try {
    await api.put("/users/me/password", request);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Inicia el proceso de cambio de email enviando un token al nuevo correo.
 * @param request - Objeto con el nuevo email y la contraseña actual para verificar identidad.
 */
export const changeEmail = async (
  request: ChangeEmailRequest,
): Promise<void> => {
  try {
    await api.put("/users/me/email", request);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Permite cambiar el correo a usuarios que aún no han confirmado su cuenta inicial.
 * @param request - Objeto con la nueva dirección de correo electrónico.
 */
export const changeUnconfirmedEmail = async (
  request: ChangeUnconfirmedEmailRequest,
): Promise<void> => {
  try {
    await api.put("/users/me/unconfirmed-email", request);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Confirma el cambio de correo electrónico utilizando el token enviado al nuevo email.
 * @param email - El nuevo correo electrónico a confirmar.
 * @param token - El token de validación recibido.
 */
export const confirmEmailChange = async (
  email: string,
  token: string,
): Promise<void> => {
  try {
    const params = new URLSearchParams({ email, token });
    await api.post(`/users/confirm-email-change?${params.toString()}`);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Permite a un usuario adquirir un nuevo rol (ej. de Guest a Host).
 * @param request - Objeto con el rol que se desea agregar.
 * @returns Un objeto AuthResponse con el nuevo token JWT que incluye los claims actualizados.
 */
export const addRole = async (
  request: AddRoleRequest,
): Promise<AuthResponse> => {
  try {
    const { data } = await api.post("/users/me/role", request);
    return validateApiRes(data, authResponseSchema);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Obtiene el perfil público de cualquier usuario mediante su ID.
 * @param id - Identificador único (GUID) del usuario.
 * @returns Información pública del perfil (nombre, apellido, fecha de creación).
 */
export const getPublicProfile = async (
  id: string,
): Promise<PublicProfileResponse> => {
  try {
    const { data } = await api.get(`/users/${id}/public`);
    return validateApiRes(data, publicProfileResponseSchema);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Obtiene las estadísticas del panel de control para usuarios con rol Host.
 * @returns Un objeto con el conteo de propiedades, reservas e ingresos totales.
 */
export const getHostDashboardStats =
  async (): Promise<HostDashboardStatsResponse> => {
    try {
      const { data } = await api.get("/users/host/dashboard");
      return validateApiRes(data, hostDashboardStatsResponseSchema);
    } catch (error) {
      handleApiError(error);
    }
  };
