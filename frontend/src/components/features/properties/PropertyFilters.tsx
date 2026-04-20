// frontend/src/components/features/properties/PropertyFilters.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoFilterOutline, IoCloseOutline } from "react-icons/io5";

import { Form } from "@/components/shared/form/Form";
import { InputField } from "@/components/shared/form/InputField";
import { Button } from "@/components/shared/Button";
import { useQueryString } from "@/hooks/shared/useQueryString";
import {
  propertySearchSchema,
  type PropertySearchRequest,
} from "@/schemas/properties.schemas";

interface PropertyFiltersProps {
  onCloseMobile?: () => void; // Para cerrar el sidebar/modal en móviles
}

export function PropertyFilters({
  onCloseMobile,
}: Readonly<PropertyFiltersProps>) {
  const router = useRouter();
  const { createUrl, searchParams } = useQueryString();
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const form = useForm<PropertySearchRequest>({
    resolver: zodResolver(propertySearchSchema),
    defaultValues: {
      // ARSENAL LOGIC: String vacío "" en vez de undefined para que RHF controle bien el input
      location: searchParams.get("location") || "",
      capacity: searchParams.get("capacity")
        ? Number(searchParams.get("capacity"))
        : undefined,
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
    },
  });

  // Sincronizar formulario con la URL (Fuente de Verdad)
  useEffect(() => {
    let count = 0;
    if (searchParams.get("location")) count++;
    if (searchParams.get("capacity")) count++;
    if (searchParams.get("minPrice")) count++;
    if (searchParams.get("maxPrice")) count++;
    if (searchParams.get("startDate")) count++;

    setActiveFiltersCount(count);

    form.reset({
      // ARSENAL LOGIC: Mismo ajuste aquí
      location: searchParams.get("location") || "",
      capacity: searchParams.get("capacity")
        ? Number(searchParams.get("capacity"))
        : undefined,
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
    });
  }, [searchParams, form]);

  const onSubmit = (data: PropertySearchRequest) => {
    // ARSENAL LOGIC: Como ya usamos setValueAs en los inputs, los NaNs ya no existen (son undefined).
    // Usamos ?? null para asegurarnos de que si alguien pone '0' en el minPrice, no se evalúe como false y se borre.
    const urlWithParams = createUrl({
      location: data.location?.trim() || null,
      capacity: data.capacity?.toString() ?? null,
      minPrice: data.minPrice?.toString() ?? null,
      maxPrice: data.maxPrice?.toString() ?? null,
      // Mantenemos las fechas que ya existan en la URL
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
    });

    router.push(urlWithParams, { scroll: false });
    if (onCloseMobile) onCloseMobile();
  };

  const clearFilters = () => {
    form.reset({
      location: "", // ARSENAL LOGIC: Limpiamos con string vacío
      capacity: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });

    // Limpiamos la URL pero mantenemos la página
    router.push(
      createUrl({
        location: null,
        capacity: null,
        minPrice: null,
        maxPrice: null,
        startDate: null,
        endDate: null,
      }),
      { scroll: false },
    );

    if (onCloseMobile) onCloseMobile();
  };

  return (
    <div className="bg-white rounded-4xl border border-slate-200 shadow-sm p-6 flex flex-col h-full max-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <IoFilterOutline size={20} className="text-slate-700" />
          <h2 className="text-lg font-bold text-slate-900">Filtros</h2>
          {activeFiltersCount > 0 && (
            <span className="bg-primary-100 text-primary-700 text-xs font-black px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>

        {/* Botón cerrar para móviles */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-colors"
          >
            <IoCloseOutline size={24} />
          </button>
        )}
      </div>

      <Form
        form={form}
        onSubmit={onSubmit}
        className="flex-1 flex flex-col gap-8 overflow-y-auto custom-scrollbar pr-2"
      >
        {/* Destino y Capacidad */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Viaje
          </h3>
          <InputField
            name="location"
            label="Ubicación"
            placeholder="Ej: Punta Cana"
          />
          <InputField
            name="capacity"
            label="Huéspedes"
            type="number"
            min={1}
            placeholder="Cualquier cantidad"
            rules={{
              setValueAs: (v) => (v === "" ? undefined : parseInt(v, 10)),
            }}
          />
        </section>

        {/* Rango de Precios */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Precio por noche
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              name="minPrice"
              label="Mínimo ($)"
              type="number"
              min={0}
              placeholder="0"
              rules={{
                setValueAs: (v) => (v === "" ? undefined : parseInt(v, 10)),
              }}
            />
            <InputField
              name="maxPrice"
              label="Máximo ($)"
              type="number"
              min={0}
              placeholder="Sin límite"
              rules={{
                setValueAs: (v) => (v === "" ? undefined : parseInt(v, 10)),
              }}
            />
          </div>
          {form.watch("minPrice") !== undefined &&
            form.watch("maxPrice") !== undefined &&
            form.watch("minPrice")! > form.watch("maxPrice")! && (
              <p className="text-xs text-red-500 font-medium">
                El mínimo no puede ser mayor al máximo.
              </p>
            )}
        </section>

        {/* Footer Actions (Sticky al fondo) */}
        <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-3">
          <Button type="submit" size="lg" className="w-full rounded-xl">
            Mostrar resultados
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={clearFilters}
            className="w-full rounded-xl"
            disabled={activeFiltersCount === 0}
          >
            Limpiar filtros
          </Button>
        </div>
      </Form>
    </div>
  );
}
