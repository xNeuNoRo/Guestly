import { z } from "zod";

// --- Schemas de Petición (Requests) ---

export const createReviewSchema = z.object({
  propertyId: z.uuid({ error: "El ID de la propiedad es inválido" }),
  reservationId: z.uuid({ error: "El ID de la reserva es inválido" }),
  rating: z
    .number({ error: "La calificación es obligatoria" })
    .min(1, { error: "La calificación mínima es 1" })
    .max(5, { error: "La calificación máxima es 5" }),
  comment: z.string().min(1, { error: "El comentario no puede estar vacío" }),
});

export type CreateReviewRequest = z.infer<typeof createReviewSchema>;

export const updateReviewSchema = z.object({
  rating: z
    .number({ error: "La calificación es obligatoria" })
    .min(1, { error: "La calificación mínima es 1" })
    .max(5, { error: "La calificación máxima es 5" }),
  comment: z.string().min(1, { error: "El comentario no puede estar vacío" }),
});

export type UpdateReviewRequest = z.infer<typeof updateReviewSchema>;

// --- Schemas de Respuesta (Responses) ---

export const reviewResponseSchema = z.object({
  id: z.uuid(),
  propertyId: z.uuid(),
  propertyTitle: z.string(),
  rating: z.number(),
  comment: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullable().optional(),
  guestId: z.uuid(),
  guestFullName: z.string(),
});

export type ReviewResponse = z.infer<typeof reviewResponseSchema>;
