"use client";

import { ComponentProps } from "react";
import { FieldValues, FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form";

interface FormProps<T extends FieldValues> extends Omit<ComponentProps<"form">, "onSubmit"> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
}

/**
 * @description Wrapper principal para formularios. 
 * Inyecta el contexto de React Hook Form a todos los componentes hijos.
 */
export function Form<T extends FieldValues>({ 
  form, 
  onSubmit, 
  children, 
  className, 
  ...props 
}: Readonly<FormProps<T>>) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className} {...props}>
        {children}
      </form>
    </FormProvider>
  );
}