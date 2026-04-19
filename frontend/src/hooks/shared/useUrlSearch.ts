import { useState, useEffect } from "react";
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

  // Obtener el valor inicial desde la URL
  const initialValue = searchParams.get(paramName) || "";

  // Estado local para el valor del input de búsqueda
  const [keyword, setKeyword] = useState(initialValue);

  // Guardamos el último valor de la URL procesado para detectar cambios externos (ej. botón atrás)
  const [prevUrlValue, setPrevUrlValue] = useState(initialValue);

  // Valor debounced para usar en las Queries de la API
  const debouncedKeyword = useDebounce(keyword, delay);

  // Sincronización del URL al Local State
  // Útil para cuando el usuario usa botones de Atrás/Adelante o limpia filtros.
  // Se realiza durante el render (patrón recomendado) para evitar "cascading renders" y cumplir con las reglas de React.
  const urlValue = searchParams.get(paramName) || "";
  if (urlValue !== prevUrlValue) {
    setPrevUrlValue(urlValue);
    setKeyword(urlValue);
  }

  // Sincronización del Local State al URL con debounce
  useEffect(() => {
    const currentUrlValue = searchParams.get(paramName) || "";

    // Evitamos navegar si el valor ya es el mismo (previene bucles y DEP0169)
    if (debouncedKeyword === currentUrlValue) return;

    const url = createUrl({ [paramName]: debouncedKeyword || null });
    router.replace(url, { scroll: false });
  }, [debouncedKeyword, paramName, createUrl, router, searchParams]);

  return {
    keyword, // Se pasa al "value" del input
    setKeyword, // Se pasa al "onChange" del input
    debouncedKeyword, // Se pasa al "useQuery" (API)
    clear: () => setKeyword(""), // Función de utilidad para limpiar
  };
}
