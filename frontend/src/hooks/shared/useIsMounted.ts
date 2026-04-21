import { useSyncExternalStore } from "react";

/**
 * @description Función de suscripción vacía. Como el estado de "montado" no cambia
 * una vez que entramos al cliente, no necesitamos escuchar cambios externos.
 */
const emptySubscribe = () => () => {};

/**
 * @description Hook personalizado para verificar si el componente ha completado su fase de montaje en el cliente (hidratación).
 * Refinado utilizando 'useSyncExternalStore' para eliminar errores de "cascading renders" y "hydration mismatch".
 * Este patrón es el más eficiente en React moderno (18/19+) para separar la lógica de servidor y cliente.
 * @returns Un valor booleano: `false` en el servidor (SSR) y `true` una vez que el componente se hidrata en el cliente.
 */
export function useIsMounted(): boolean {
  // useSyncExternalStore maneja internamente la diferencia entre el render de servidor
  // y el de cliente, evitando disparar un useEffect que cause un segundo renderizado manual.
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // Snapshot en el cliente
    () => false, // Snapshot en el servidor (SSR)
  );
}
