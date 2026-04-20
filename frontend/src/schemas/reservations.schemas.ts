import { z } from "zod";

// --- Enums ---
export const ReservationStatusSchema = z.enum([
  "Pending",
  "Confirmed",
  "Cancelled",
  "Completed",
]);
export const ReservationStatusMutate = ReservationStatusSchema.exclude([
  "Pending",
  "Completed",
]);
export type ReservationStatus = z.infer<typeof ReservationStatusSchema>;
export type ReservationStatusMutate = z.infer<typeof ReservationStatusMutate>;

// --- Schemas de Petición (Requests) ---

export const createReservationSchema = z.object({
  propertyId: z.uuid({ error: "El ID de la propiedad es inválido" }),
  startDate: z.date({ error: "La fecha de inicio es obligatoria" }),
  endDate: z.date({ error: "La fecha de fin es obligatoria" }),
});
export type CreateReservationRequest = z.infer<typeof createReservationSchema>;

export const reservationSearchSchema = z.object({
  propertyId: z.uuid().optional(),
  guestId: z.uuid().optional(),
  hostId: z.uuid().optional(),
  status: ReservationStatusSchema.optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});
export type ReservationSearchRequest = z.infer<typeof reservationSearchSchema>;

export const updateReservationStatusSchema = z.object({
  newStatus: ReservationStatusMutate,
});
export type UpdateReservationStatusRequest = z.infer<
  typeof updateReservationStatusSchema
>;

export const createPropertyBlockSchema = z.object({
  propertyId: z.uuid({ error: "El ID de la propiedad es inválido" }),
  startDate: z.date({ error: "La fecha de inicio es obligatoria" }),
  endDate: z.date({ error: "La fecha de fin es obligatoria" }),
  reason: z.string().optional(),
});
export type CreatePropertyBlockRequest = z.infer<
  typeof createPropertyBlockSchema
>;

export const updatePropertyBlockSchema = z.object({
  startDate: z.date({ error: "La fecha de inicio es obligatoria" }),
  endDate: z.date({ error: "La fecha de fin es obligatoria" }),
  reason: z.string().optional(),
});
export type UpdatePropertyBlockRequest = z.infer<
  typeof updatePropertyBlockSchema
>;

// --- Schemas de Respuesta (Responses) ---

export const pricePreviewResponseSchema = z.object({
  totalNights: z.number(),
  pricePerNight: z.number(),
  subtotal: z.number(),
  cleaningFee: z.number(),
  serviceFee: z.number(),
  taxes: z.number(),
  grandTotal: z.number(),
});
export type PricePreviewResponse = z.infer<typeof pricePreviewResponseSchema>;

export const propertyBlockResponseSchema = z.object({
  id: z.uuid(),
  propertyId: z.uuid(),
  startDate: z.date(),
  endDate: z.date(),
  reason: z.string().nullable().optional(),
  createdAt: z.date(),
});
export type PropertyBlockResponse = z.infer<typeof propertyBlockResponseSchema>;

export const reservationResponseSchema = z.object({
  id: z.uuid(),
  propertyId: z.uuid(),
  propertyTitle: z.string(),
  propertyLocation: z.string(),
  propertyThumbnailUrl: z.string(),
  guestId: z.uuid(),
  guestName: z.string(),
  hostId: z.uuid(),
  hostName: z.string(),
  checkInDate: z.date(),
  checkOutDate: z.date(),
  pricePerNightAtBooking: z.number(),
  cleaningFeeAtBooking: z.number(),
  serviceFeeAtBooking: z.number(),
  taxesAtBooking: z.number(),
  totalPrice: z.number(),
  status: ReservationStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date().nullable().optional(),
});
export type ReservationResponse = z.infer<typeof reservationResponseSchema>;
