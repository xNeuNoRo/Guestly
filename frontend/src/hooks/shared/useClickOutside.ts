import { useEffect, type RefObject } from "react";

// Hook personalizado para detectar clics fuera de un elemento referenciado y ejecutar una función de manejo
type Handler = (event: MouseEvent | TouchEvent) => void;

/**
 * @description Hook personalizado para detectar clics fuera de un elemento referenciado y ejecutar una función de manejo.
 * Agrega event listeners para "mousedown" y "touchstart" al documento, y verifica si el evento ocurrió fuera del elemento referenciado.
 * Si es así, ejecuta la función de manejo proporcionada. Limpia los event listeners al desmontar el componente.
 * @param ref La referencia al elemento del cual se desea detectar clics fuera. Debe ser un RefObject que apunte a un elemento HTML o null.
 * Si el evento ocurre dentro de este elemento, no se ejecutará la función de manejo.
 * @param handler La función de manejo que se ejecutará cuando se detecte un clic fuera del elemento referenciado. Recibe el evento de tipo MouseEvent o TouchEvent como argumento.
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null | undefined>,
  handler: Handler,
): void {
  // Usamos un useEffect para agregar los event listeners al documento
  // cuando el componente se monta, y limpiarlos cuando se desmonta
  useEffect(() => {
    // Función que se ejecuta cuando se detecta un evento de clic o toque en el documento
    const listener = (event: MouseEvent | TouchEvent) => {
      // Obtenemos el elemento referenciado por el ref, si existe
      const el = ref?.current;

      // No hacer nada si el click fue dentro del elemento o si no hay referencia
      // Verificamos también que event.target sea un Node válido
      if (!el || !event.target || el.contains(event.target as Node)) {
        return;
      }

      // Si el click fue fuera del elemento, ejecutamos el handler proporcionado
      handler(event);
    };

    // Agregamos los event listeners para "mousedown" y "touchstart" al documento
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener, { passive: true });

    // Limpiamos los event listeners cuando el componente se desmonta
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]); // Re-ejecutar el efecto si cambian la referencia o el handler
}
