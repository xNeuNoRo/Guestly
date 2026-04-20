import { z } from "zod";

export const UserRoleSchema = z.enum(["None", "Guest", "Host"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

// --- Schemas de Petición (Requests) ---

export const loginSchema = z.object({
  email: z.email({
    error: "Formato de correo inválido",
  }),
  password: z.string().min(1, {
    error: "La contraseña no puede estar vacía",
  }),
});
export type LoginRequest = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: z.string().min(2, {
    error: "El nombre debe tener al menos 2 caracteres",
  }),
  lastName: z.string().min(2, {
    error: "El apellido debe tener al menos 2 caracteres",
  }),
  email: z.email({
    error: "Formato de correo inválido",
  }),
  password: z.string().min(8, {
    error: "La contraseña debe tener al menos 8 caracteres",
  }),
  role: UserRoleSchema,
});
export type RegisterRequest = z.infer<typeof registerSchema>;

export const resendConfirmationSchema = z.object({
  email: z.email({
    error: "Formato de correo inválido",
  }),
});
export type ResendConfirmationEmailRequest = z.infer<
  typeof resendConfirmationSchema
>;

export const forgotPasswordSchema = z.object({
  email: z.email({
    error: "Formato de correo inválido",
  }),
});
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  email: z.email({
    error: "Formato de correo inválido",
  }),
  token: z.string().min(1, {
    error: "El token de seguridad es obligatorio",
  }),
  newPassword: z.string().min(8, {
    error: "La contraseña debe tener al menos 8 caracteres",
  }),
});
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;

// --- Schemas de Respuesta (Responses) ---

export const authResponseSchema = z.object({
  id: z.uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email({
    error: "Formato de correo inválido",
  }),
  role: z.array(UserRoleSchema),
  token: z.string(),
  createdAt: z.date(),
  isEmailConfirmed: z.boolean(),
});
export type AuthResponse = z.infer<typeof authResponseSchema>;
