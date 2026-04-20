import { z } from "zod";

// --- Enums ---
export const NotificationTypeSchema = z.enum([
  "System",
  "ReservationRequested",
  "ReservationConfirmed",
  "ReservationCancelled",
  "ReservationCompleted",
]);
export type NotificationType = z.infer<typeof NotificationTypeSchema>;

// --- Schemas de Respuesta (Responses) ---
export const notificationResponseSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  title: z.string(),
  message: z.string(),
  type: NotificationTypeSchema,
  isRead: z.boolean(),
  createdAt: z
    .string()
    .refine((date) => !Number.isNaN(Date.parse(date)), {
      message: "Fecha de creación inválida",
    })
    .transform((date) => new Date(date)),
  readAt: z
    .string()
    .refine((date) => !Number.isNaN(Date.parse(date)), {
      message: "Fecha de lectura inválida",
    })
    .transform((date) => new Date(date))
    .nullable()
    .optional(),
});

export type NotificationResponse = z.infer<typeof notificationResponseSchema>;
