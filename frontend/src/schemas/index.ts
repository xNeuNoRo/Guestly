import { z } from "zod";

// Respuestas de error de la API

// Esquema para errores generales de la API
export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.array(z.string())).optional().nullable(),
});

// Tipos inferidos para los errores
export type ApiError = z.infer<typeof ApiErrorSchema>;

// Tipo TypeScript inferido a partir del esquema de respuesta de la API
// Solamente dos estados posibles, uno con datos y sin error, y otro con error y sin datos
export type ApiResponseStrictFromSchema<T extends z.ZodType> =
  | { ok: true; data: z.infer<T>; error: null }
  | { ok: false; data: null; error: ApiError };

// Factory para crear un esquema de respuesta de la API que valida tanto el caso de éxito como el de error
export const ApiResponseStrictSchema = <T extends z.ZodType>(dataSchema: T) =>
  // Usamos discriminatedUnion para garantizar que solo uno de los dos estados sea posible
  // El valor a discriminar es "ok", que es un booleano literal en cada caso
  z.discriminatedUnion("ok", [
    // Caso de éxito: ok es true, data es del tipo esperado, error es null
    z.object({
      ok: z.literal(true),
      data: dataSchema,
      error: z.null(),
    }),
    // Caso de error: ok es false, data es null, error es del tipo ApiError
    z.object({
      ok: z.literal(false),
      data: z.null(),
      error: ApiErrorSchema,
    }),
  ]) as z.ZodType<ApiResponseStrictFromSchema<T>>;

// Esquema para validar UUIDs, con un mensaje de error personalizado
export const UUIDSchema = z.uuid("Formato de identificador inválido").trim();

// Esquema base para entidades con ID y timestamps
export const BaseEntitySchema = z.object({
  id: UUIDSchema,
  createdAt: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
    message: "La fecha de creación debe ser una fecha válida",
  }),
  updatedAt: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
    message: "La fecha de última actualización debe ser una fecha válida",
  }),
});

/**
 * @description Valida un ID utilizando el esquema UUIDSchema.
 * Si el ID no es válido, lanza un error genérico de seguridad para evitar revelar información sobre la validación.
 * @param id El ID a validar, que puede ser una cadena, un número o undefined. Se convertirá a cadena antes de la validación.
 * @returns El ID validado como cadena si es válido.
 * @throws Error genérico de seguridad si el ID no es válido, sin revelar detalles específicos sobre la validación.
 */
export const validateId = (id: string | number | undefined): string => {
  const result = UUIDSchema.safeParse(String(id));
  if (!result.success) {
    // Lanzar un error genérico de seguridad
    throw new Error("Alerta de seguridad: Formato de identificador inválido");
  }
  return result.data;
};