import { useEffect, useState, useRef } from "react";

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  triggerOnce?: boolean; // Si es true, una vez detectado, dejará de observar (ideal para animaciones)
}

/**
 * @description Hook personalizado para observar la visibilidad de un elemento en el viewport.
 * Especialmente útil para disparar animaciones de entrada, revelar contenido gradualmente
 * o realizar lazy loading de componentes pesados.
 * @param options Opciones de configuración del IntersectionObserver (root, rootMargin, threshold) y triggerOnce.
 * @returns Un objeto que contiene la referencia 'targetRef' para el elemento y el booleano 'isIntersecting'.
 */
export function useIntersectionObserver({
  threshold = 0.1,
  root = null,
  rootMargin = "0px",
  triggerOnce = false,
}: UseIntersectionObserverOptions = {}) {
  // Estado para saber si el elemento es visible
  const [isIntersecting, setIntersecting] = useState(false);

  // Referencia al elemento que queremos observar
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    // Creamos el observador
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementVisible = entry.isIntersecting;
        setIntersecting(isElementVisible);

        // Si se configuró para disparar una sola vez y el elemento ya es visible, desconectamos
        if (isElementVisible && triggerOnce) {
          observer.unobserve(element);
        }
      },
      { threshold, root, rootMargin },
    );

    observer.observe(element);

    // Limpiamos la conexión al desmontar el componente para evitar fugas de memoria
    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, triggerOnce]);

  return { targetRef, isIntersecting };
}
