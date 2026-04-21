import { useCallback, useState } from "react";

/**
 * @description Hook personalizado para gestionar estados booleanos (interruptores).
 * Proporciona un valor actual y funciones memorizadas para alternar el estado o forzarlo a true/false.
 * Ideal para manejar la visibilidad de modales, menús desplegables, sidebars o contraseñas.
 * @param initialValue Valor inicial del estado (por defecto false).
 * @returns Un objeto con el valor actual y funciones para manipularlo (toggle, setTrue, setFalse).
 */
export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);

  // Memorizamos las funciones con useCallback para evitar re-renderizados
  // innecesarios en componentes hijos que reciban estas funciones como props.

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
  };
}
