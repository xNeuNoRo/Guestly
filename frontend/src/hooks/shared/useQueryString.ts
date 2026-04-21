"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * @description Hook personalizado para manejar la generación de URLs con query strings en Next.js. Este hook proporciona una función createUrl que permite crear URLs completas fusionando los parámetros de búsqueda actuales con nuevos valores proporcionados.
 * @returns Un objeto que contiene la función createUrl, así como los searchParams y pathname actuales. La función createUrl toma un objeto de actualizaciones donde las claves son los nombres de los parámetros y los valores son los nuevos valores para esos parámetros. Si el valor es null, undefined o una cadena vacía, el parámetro se eliminará de la URL. La función devuelve la URL completa que incluye el pathname y la query string actualizada.
 */
export const useQueryString = () => {
  // Hooks de navegación y búsqueda para generar URLs dinámicamente basadas en el estado actual de la URL
  const searchParams = useSearchParams();
  const pathname = usePathname();

  /**
   * @description Genera una URL completa fusionando los parámetros actuales con los nuevos.
   * @param updates Objeto con los nuevos valores. Si envías null, undefined o "", el parámetro se elimina.
   * @returns La URL completa (pathname + query string).
   */
  const createUrl = useCallback(
    (updates: Record<string, string | number | null | undefined>) => {
      // Creamos una nueva instancia de URLSearchParams basada en los searchParams actuales para modificarla
      const params = new URLSearchParams(searchParams.toString());

      // Iteramos sobre las actualizaciones proporcionadas y las aplicamos a los parámetros de búsqueda
      Object.entries(updates).forEach(([key, value]) => {
        // Si el valor es null, undefined o una cadena vacía, eliminamos el parámetro de la URL
        if (value === null || value === undefined || value === "") {
          params.delete(key);
        }
        // De lo contrario, establecemos o actualizamos el parámetro con el nuevo valor
        else {
          params.set(key, String(value));
        }
      });

      // Retornamos la URL completa que incluye el pathname y la query string actualizada
      const queryString = params.toString();
      return queryString ? `${pathname}?${queryString}` : pathname;
    },
    [searchParams, pathname],
  );

  // Retornamos la función createUrl junto con los searchParams y pathname actuales para que puedan ser utilizados en los componentes que consuman este hook
  return { createUrl, searchParams, pathname };
};