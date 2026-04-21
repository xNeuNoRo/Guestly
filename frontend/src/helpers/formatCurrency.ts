/**
 * @description Formatea un número como moneda local.
 * Reutiliza una única instancia si los parámetros son los mismos,
 * pero por simplicidad y rendimiento general, exportamos la función pura.
 * * @param amount Cantidad a formatear
 * @param currency Código ISO de la moneda (default: USD)
 * @param locale Configuración regional (default: es-DO)
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "es-DO",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2, // Buena práctica por si hay centavos
  }).format(amount);
}
