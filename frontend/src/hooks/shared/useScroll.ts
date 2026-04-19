import { useSyncExternalStore } from "react";

interface ScrollState {
  x: number;
  y: number;
  direction: "up" | "down" | null;
}

// Mantenemos una referencia fuera del hook para el cálculo de dirección
// sin provocar re-renders innecesarios por estados intermedios.
let lastScrollY = 0;

/**
 * @description Hook de scroll ultra-refinado. 
 * Proporciona las coordenadas X/Y y la dirección del desplazamiento.
 * Utiliza 'useSyncExternalStore' para una sincronización perfecta con el SSR.
 * @returns Un objeto con la posición actual (x, y) y la dirección ('up', 'down' o null).
 */
export function useScroll(): ScrollState {
  return useSyncExternalStore(
    // Suscripción: Escuchamos el evento de scroll del navegador
    (callback) => {
      if (globalThis.window === undefined) return () => {};

      const handleScroll = () => {
        // Ejecutamos el callback que React proporciona para sincronizar el store
        callback();
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    },
    // Snapshot (Cliente): Calculamos la posición y dirección actual
    () => {
      if (globalThis.window === undefined) return { x: 0, y: 0, direction: null };

      const currentY = window.scrollY;
      const currentX = window.scrollX;
      
      let direction: "up" | "down" | null = null;

      if (currentY > lastScrollY) {
        direction = "down";
      } else if (currentY < lastScrollY) {
        direction = "up";
      }

      lastScrollY = currentY;

      return {
        x: currentX,
        y: currentY,
        direction,
      };
    },
    // Snapshot (Servidor): Valor inicial para el renderizado inicial
    () => ({ x: 0, y: 0, direction: null })
  );
}