import { useSyncExternalStore } from "react";

/**
 * @description Hook para detectar media queries de CSS en JS.
 * Utiliza 'useSyncExternalStore' para garantizar que el estado sea consistente entre
 * el servidor y el cliente, evitando errores de hidratación (Hydration Mismatch).
 * @param query La regla de CSS a evaluar (ej: '(min-width: 768px)').
 * @returns 'true' si la query coincide, 'false' de lo contrario o durante el SSR.
 * @example
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 * if (isDesktop) {
 *   // Renderizar versión de escritorio
 * } else {
 *   // Renderizar versión móvil
 * }
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    // Nos subscribimos con el listener de cambios en el navegador
    (callback) => {
      if (globalThis.window === undefined) return () => {};

      const matchMedia = globalThis.matchMedia(query);

      // Usamos el evento 'change' (moderno) en lugar de 'addListener' (deprecated)
      matchMedia.addEventListener("change", callback);

      return () => {
        matchMedia.removeEventListener("change", callback);
      };
    },
    // Client Snapshot: Evaluamos la media query en el momento de la suscripción
    () => {
      if (globalThis.window === undefined) return false;
      return globalThis.matchMedia(query).matches;
    },
    // Server Snapshot: Valor por defecto para el renderizado del lado del servidor
    // Siempre devolvemos 'false' para que el primer render sea consistente.
    () => false,
  );
}
