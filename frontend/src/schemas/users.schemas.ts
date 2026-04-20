import { z } from "zod";
import { UserRoleSchema } from "./auth.schemas";

// --- Schemas de Petición (Requests) ---

export const updateUserProfileSchema = z.object({
  firstName: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres",
  }),
  lastName: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres",
  }),
});
export type UpdateUserProfileRequest = z.infer<typeof updateUserProfileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, {
    message: "La contraseña actual es obligatoria",
  }),
  newPassword: z.string().min(8, {
    message: "La contraseña debe tener al menos 8 caracteres",
  }),
  confirmNewPassword: z.string().min(8, {
    message: "La confirmación debe tener al menos 8 caracteres",
  }),
});
export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>;

export const changeEmailSchema = z.object({
  newEmail: z.email({
    message: "Formato de correo inválido",
  }),
  password: z.string().min(1, {
    message: "La contraseña es obligatoria",
  }),
});
export type ChangeEmailRequest = z.infer<typeof changeEmailSchema>;

export const changeUnconfirmedEmailSchema = z.object({
  newEmail: z.email({
    message: "Formato de correo inválido",
  }),
});
export type ChangeUnconfirmedEmailRequest = z.infer<
  typeof changeUnconfirmedEmailSchema
>;

export const addRoleSchema = z.object({
  roleToAdd: UserRoleSchema,
});
export type AddRoleRequest = z.infer<typeof addRoleSchema>;

// --- Schemas de Respuesta (Responses) ---

export const userProfileResponseSchema = z.object({
  id: z.uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email({
    message: "Formato de correo inválido",
  }),
  role: z.array(UserRoleSchema),
  createdAt: z
    .string()
    .refine((date) => !Number.isNaN(Date.parse(date)), {
      message: "Fecha de creación inválida",
    })
    .transform((date) => new Date(date)),
  isEmailConfirmed: z.boolean(),
});
export type UserProfileResponse = z.infer<typeof userProfileResponseSchema>;

export const publicProfileResponseSchema = z.object({
  id: z.uuid(),
  firstName: z.string(),
  lastName: z.string(),
  createdAt: z
    .string()
    .refine((date) => !Number.isNaN(Date.parse(date)), {
      message: "Fecha de creación inválida",
    })
    .transform((date) => new Date(date)),
});
export type PublicProfileResponse = z.infer<typeof publicProfileResponseSchema>;

export const hostDashboardStatsResponseSchema = z.object({
  totalProperties: z.number(),
  totalReservations: z.number(),
  pendingReservations: z.number(),
  totalRevenue: z.number(),
});
export type HostDashboardStatsResponse = z.infer<
  typeof hostDashboardStatsResponseSchema
>;
