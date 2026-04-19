import { useVirtualizer, VirtualItem, type VirtualizerOptions } from "@tanstack/react-virtual";
import { useCallback, useRef } from "react";

interface UseVirtualListOptions<T, TScrollElement extends Element> {
  data: T[];
  estimateSize: number | ((index: number) => number);
  overscan?: number;
  horizontal?: boolean;
  // Opciones extra por si necesitas scroll fluido o callbacks de cambio de rango
  virtualizerOptions?: Partial<VirtualizerOptions<TScrollElement, Element>>;
}

/**
 * @description Hook ultra-refinado para simplificar listas virtuales con TanStack Virtual.
 * Encapsula la gestión de la referencia del contenedor, el cálculo de dimensiones
 * y proporciona los estilos de posicionamiento absoluto listos para usar.
 * @param options Configuración de datos, tamaño estimado y dirección.
 * @returns Un objeto con la referencia del contenedor, los items virtuales y utilidades de scroll.
 */
export function useVirtualList<T, TScrollElement extends HTMLElement = HTMLDivElement>({
  data,
  estimateSize,
  overscan = 5,
  horizontal = false,
  virtualizerOptions,
}: UseVirtualListOptions<T, TScrollElement>) {
  // Referencia del contenedor (el que tiene el scroll)
  const parentRef = useRef<TScrollElement>(null);

  // Configuración del virtualizador
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: typeof estimateSize === "number" ? () => estimateSize : estimateSize,
    overscan,
    horizontal,
    ...virtualizerOptions,
  });

  // Helper para obtener los estilos del contenedor interno (el que da el alto/ancho total)
  const getTotalSize = () => rowVirtualizer.getTotalSize();

  // Helper para obtener el estilo de cada item (posicionamiento absoluto)
  const getItemStyle = useCallback(
    (virtualItem: VirtualItem) => ({
      position: "absolute",
      top: 0,
      left: 0,
      width: horizontal ? `${virtualItem.size}px` : "100%",
      height: horizontal ? "100%" : `${virtualItem.size}px`,
      transform: horizontal
        ? `translateX(${virtualItem.start}px)`
        : `translateY(${virtualItem.start}px)`,
    }),
    [horizontal]
  );

  return {
    parentRef,
    virtualItems: rowVirtualizer.getVirtualItems(),
    totalSize: getTotalSize(),
    scrollToIndex: rowVirtualizer.scrollToIndex,
    scrollToOffset: rowVirtualizer.scrollToOffset,
    getItemStyle,
    virtualizer: rowVirtualizer,
  };
}