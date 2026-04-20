"use client";

import {
  useFormContext,
  useFormState,
  type RegisterOptions,
} from "react-hook-form";
import { Input, type InputProps } from "../Input";

interface InputFieldProps extends Omit<InputProps, "name" | "error"> {
  name: string; // El nombre estricto que hace match con el esquema de Zod
  rules?: RegisterOptions; // Opciones adicionales de react-hook-form (ej: valueAsNumber)
}

/**
 * @description Input inteligente que se conecta automáticamente al <Form> padre.
 * Gestiona su propio estado de error, registro y accesibilidad.
 */
export function InputField({
  name,
  rules,
  ...props
}: Readonly<InputFieldProps>) {
  const { register, control } = useFormContext();

  // useFormState obliga a RHF a suscribir este componente a los errores de 'name'
  const { errors } = useFormState({ control, name });

  // Navegación segura para extraer el error, soportando nombres con puntos (ej: "user.email")
  const fieldError = name.split(".").reduce<unknown>((obj, key) => {
    if (typeof obj === "object" && obj !== null && key in obj) {
      return (obj as Record<string, unknown>)[key];
    }

    return undefined;
  }, errors);

  const errorMessage =
    typeof fieldError === "object" &&
    fieldError !== null &&
    "message" in fieldError
      ? (fieldError as { message?: string }).message
      : undefined;

  return (
    <Input
      {...register(name, rules)}
      error={errorMessage}
      {...props}
    />
  );
}
