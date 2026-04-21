import { getSafeLocalDate } from "@/helpers/getSafeLocalDate";
import { z } from "zod";

// --- Sub-schemas ---

export const hostSummaryResponseSchema = z.object({
  hostId: z.uuid(),
  hostName: z.string(),
});

export const dateRangeResponseSchema = z.object({
  startDate: z
    .string()
    .refine((date) => !Number.isNaN(Date.parse(date)), {
      message: "Fecha de inicio inválida",
    })
    .transform((date) => getSafeLocalDate(date)),
  endDate: z
    .string()
    .refine((date) => !Number.isNaN(Date.parse(date)), {
      message: "Fecha de fin inválida",
    })
    .transform((date) => getSafeLocalDate(date)),
});

// --- Schemas de Respuesta (Responses) ---

export const propertyResponseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string(),
  location: z.string(),
  pricePerNight: z.number(),
  cleaningFee: z.number(),
  capacity: z.number(),
  averageRating: z.number(),
  totalReviews: z.number(),
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
  host: hostSummaryResponseSchema,
  imageUrls: z.array(z.string()),
});

export type PropertyResponse = z.infer<typeof propertyResponseSchema>;
export type DateRangeResponse = z.infer<typeof dateRangeResponseSchema>;

// --- Schemas de Petición (Requests) ---

export const propertySearchSchema = z.object({
  location: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  capacity: z.number().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
});

export type PropertySearchRequest = z.infer<typeof propertySearchSchema>;

export const createPropertySchema = z.object({
  title: z.string().min(1, { message: "El título es obligatorio" }),
  description: z.string().min(1, { message: "La descripción es obligatoria" }),
  location: z.string().min(1, { message: "La ubicación es obligatoria" }),
  pricePerNight: z
    .number()
    .min(0, { message: "El precio debe ser mayor o igual a 0" }),
  cleaningFee: z
    .number()
    .min(0, { message: "La tarifa de limpieza debe ser mayor o igual a 0" }),
  capacity: z.number().min(1, { message: "La capacidad debe ser al menos 1" }),
  images: z.any(),
});

export type CreatePropertyRequest = z.infer<typeof createPropertySchema>;

export const updatePropertySchema = createPropertySchema
  .extend({
    imagesToDelete: z.array(z.string()).optional(),
  })
  .partial({
    images: true,
  });

export type UpdatePropertyRequest = z.infer<typeof updatePropertySchema>;
