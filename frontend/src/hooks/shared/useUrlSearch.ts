import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryString } from "./useQueryString"; // Tu hook de URL
import { useDebounce } from "./useDebounce"; // Tu hook de Debounce

interface UseUrlSearchOptions {
  paramName?: string; // Nombre del parámetro en la URL (por defecto "search")
  delay?: number; // Tiempo de debounce (por defecto 500ms)
}

/**
 * @description Hook personalizado para manejar un valor de búsqueda sincronizado con la URL.
 * Permite que un input de búsqueda actualice la URL y que los cambios en la URL actualicen el input,
 * con un debounce para optimizar las consultas a la API.
 * @param options Opciones para configurar el nombre del parámetro y el tiempo de debounce.
 * @returns Un objeto con el valor de búsqueda, una función para actualizarlo, el valor debounced para consultas a la API, y una función para limpiar el valor.
 */
export function useUrlSearch({
  paramName = "search",
  delay = 500,
}: UseUrlSearchOptions = {}) {
  // Hook para manejar la navegación y manipulación de URLs con query strings
  const router = useRouter();
  const { createUrl, searchParams } = useQueryString();

  // Fuente única de verdad: el valor actual en la URL
  const keyword = searchParams.get(paramName) || "";

  // Valor debounced para usar en las Queries de la API
  const debouncedKeyword = useDebounce(keyword, delay);

  // Actualiza la URL al cambiar el input
  const setKeyword = useCallback(
    (nextKeyword: string) => {
      const currentUrlValue = searchParams.get(paramName) || "";

      // Evitamos navegar si el valor ya es el mismo
      if (nextKeyword === currentUrlValue) return;

      const url = createUrl({ [paramName]: nextKeyword || null });
      router.replace(url, { scroll: false });
    },
    [createUrl, paramName, router, searchParams],
  );

  return {
    keyword, // Se pasa al "value" del input
    setKeyword, // Se pasa al "onChange" del input
    debouncedKeyword, // Se pasa al "useQuery" (API)
    clear: () => setKeyword(""), // Función de utilidad para limpiar
  };
}
