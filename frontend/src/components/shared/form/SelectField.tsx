"use client";

import { useController, useFormContext } from "react-hook-form";
import { Select, type SelectProps } from "../Select";

interface SelectFieldProps extends Omit<SelectProps, "value" | "onChange" | "error"> {
  name: string;
}

/**
 * @description Select inteligente (basado en Headless UI) conectado al <Form>.
 * Utiliza useController para gestionar la sincronización de datos asíncronos.
 */
export function SelectField({ name, ...props }: Readonly<SelectFieldProps>) {
  const { control } = useFormContext();
  
  const {
    field: { value, onChange },
    fieldState: { error }
  } = useController({ name, control });

  return (
    <Select
      value={value}
      onChange={onChange}
      error={error?.message}
      {...props}
    />
  );
}