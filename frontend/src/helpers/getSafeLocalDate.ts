/**
 * @description Convierte una fecha UTC (o string de fecha) a un objeto Date local
 * eliminando el desfase de zona horaria. Ideal para "Fechas de Calendario" (ej. check-in, check-out).
 */
export const getSafeLocalDate = (
  value?: string | Date | null,
): Date | undefined => {
  if (!value) return undefined;

  let dateString = "";

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return undefined;
    dateString = value.toISOString().split("T")[0];
  } else if (typeof value === "string") {
    dateString = value.split("T")[0];
  } else {
    return undefined;
  }

  const [year, month, day] = dateString.split("-").map(Number);
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day))
    return undefined;

  return new Date(year, month - 1, day);
};
