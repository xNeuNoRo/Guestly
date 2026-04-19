/**
 * @description Convierte un objeto de JavaScript en un FormData compatible con nuestro backend en .NET (multipart/form-data).
 * Maneja FileLists, Arrays (ej. List<string>), Fechas y serializa objetos anidados.
 */
export function objectToFormData(data: Record<string, unknown>): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    // Ignoramos nulos o indefinidos para no enviar strings vacíos o "null" al backend
    if (value === null || value === undefined) return;

    if (value instanceof FileList) {
      // Manejo específico para múltiples archivos (IFormFile)
      Array.from(value).forEach((file) => formData.append(key, file));
    } else if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      // Manejo para List<string> (ej. ImagesToDelete). nuestro backend en .NET requiere que la misma key se envíe varias veces
      value.forEach((item) => formData.append(key, String(item)));
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      typeof value === "bigint"
    ) {
      formData.append(key, value.toString());
    } else if (typeof value === "symbol") {
      formData.append(key, value.description ?? value.toString());
    } else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    }
  });

  return formData;
}
