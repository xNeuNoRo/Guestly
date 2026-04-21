import { z } from "zod";

// --- Schemas de Petición (Requests) ---

export const createReviewSchema = z.object({
  propertyId: z.uuid({ message: "El ID de la propiedad es inválido" }),
  reservationId: z.uuid({ message: "El ID de la reserva es inválido" }),
  rating: z
    .number({ message: "La calificación es obligatoria" })
    .min(1, { message: "La calificación mínima es 1" })
    .max(5, { message: "La calificación máxima es 5" }),
  comment: z.string().min(1, { message: "El comentario no puede estar vacío" }),
});

export type CreateReviewRequest = z.infer<typeof createReviewSchema>;

export const updateReviewSchema = z.object({
  rating: z
    .number({ message: "La calificación es obligatoria" })
    .min(1, { message: "La calificación mínima es 1" })
    .max(5, { message: "La calificación máxima es 5" }),
  comment: z.string().min(1, { message: "El comentario no puede estar vacío" }),
});

export type UpdateReviewRequest = z.infer<typeof updateReviewSchema>;

// --- Schemas de Respuesta (Responses) ---

export const reviewResponseSchema = z.object({
  id: z.uuid(),
  propertyId: z.uuid(),
  propertyTitle: z.string(),
  rating: z.number(),
  comment: z.string(),
  createdAt: z
    .string()
    .refine((date) => !Number.isNaN(Date.parse(date)), {
      message: "Fecha de creación inválida",
    })
    .transform((date) => new Date(date)),
  updatedAt: z
    .string()
    .refine((date) => !Number.isNaN(Date.parse(date)), {
      message: "Fecha de actualización inválida",
    })
    .transform((date) => new Date(date))
    .nullable()
    .optional(),
  guestId: z.uuid(),
  guestFullName: z.string(),
});

export type ReviewResponse = z.infer<typeof reviewResponseSchema>;
