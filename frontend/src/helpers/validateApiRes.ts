import { z } from "zod";
import { ApiResponseStrictSchema } from "@/schemas";

/**
 * @description Valida la respuesta de la API usando un esquema de Zod. Lanza errores con mensajes específicos si la validación falla o si la API responde con un error.
 * @param payload La respuesta sin procesar de la API que se desea validar.
 * @param dataSchema El esquema de Zod que describe la estructura esperada de los datos en caso de éxito. Este esquema se usará para validar el campo "data" de la respuesta.
 * @returns Los datos validados y tipados según el esquema proporcionado, si la respuesta es correcta.
 */
export function validateApiRes<S extends z.ZodTypeAny>(
  payload: unknown,
  dataSchema: S,
): z.infer<S> {
  // Validamos la estructura general de la respuesta de la API
  const result = ApiResponseStrictSchema(dataSchema).safeParse(payload);

  // Si la validación falla, lanzamos un error genérico
  if (!result.success) {
    console.log("Error de validación de API:", result.error);
    throw new Error("Error al comunicarse con el servidor");
  }

  // Si la API respondió con ok: false, lanzamos el mensaje de error específico
  if (!result.data.ok) {
    throw new Error(
      result.data.error.message ?? "Error desconocido del servidor",
    );
  }

  // Si es correcto, retornamos los datos validados
  return result.data.data;
}