"use client";

import { useFormContext, type RegisterOptions } from "react-hook-form";
import { Input, type InputProps } from "../Input";

interface InputFieldProps extends Omit<InputProps, "name" | "error"> {
  name: string; // El nombre estricto que hace match con el esquema de Zod
  rules?: RegisterOptions; // Opciones adicionales de react-hook-form (ej: valueAsNumber)
}

/**
 * @description Input inteligente que se conecta automáticamente al <Form> padre.
 * Gestiona su propio estado de error, registro y accesibilidad.
 */
export function InputField({ name, rules, ...props }: Readonly<InputFieldProps>) {
  const { register, getFieldState, formState } = useFormContext();
  
  // getFieldState maneja inteligentemente incluso campos anidados (ej: "address.city")
  const { error } = getFieldState(name, formState);

  return (
    <Input
      {...register(name, rules)}
      error={error?.message}
      {...props}
    />
  );
}