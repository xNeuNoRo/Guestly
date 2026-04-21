"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { IoSearchOutline } from "react-icons/io5";
import clsx from "clsx";
import { format, parseISO } from "date-fns";

import { Form } from "@/components/shared/form/Form";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";

import {
  propertySearchSchema,
  type PropertySearchRequest,
} from "@/schemas/properties.schemas";
import { ROUTES } from "@/constants/routes";
import { useQueryString } from "@/hooks/shared/useQueryString";

interface PropertySearchBarProps {
  className?: string;
  isCompact?: boolean;
}

export function PropertySearchBar({
  className,
  isCompact = false,
}: Readonly<PropertySearchBarProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { createUrl } = useQueryString();

  const parseDateParam = (param: string | null): Date | undefined => {
    if (!param) return undefined;
    const parsed = parseISO(param);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  };

  const form = useForm<PropertySearchRequest>({
    resolver: zodResolver(propertySearchSchema),
    defaultValues: {
      location: searchParams.get("location") || undefined,
      capacity: searchParams.get("capacity")
        ? Number(searchParams.get("capacity"))
        : undefined,
      startDate: parseDateParam(searchParams.get("startDate")),
      endDate: parseDateParam(searchParams.get("endDate")),
    },
  });

  // Sincronización controlada: solo resetea si los searchParams cambian externamente
  useEffect(() => {
    form.reset({
      location: searchParams.get("location") || undefined,
      capacity: searchParams.get("capacity")
        ? Number(searchParams.get("capacity"))
        : undefined,
      startDate: parseDateParam(searchParams.get("startDate")),
      endDate: parseDateParam(searchParams.get("endDate")),
    });
  }, [searchParams, form]);

  const onSubmit = (data: PropertySearchRequest) => {
    const startStr = data.startDate
      ? format(data.startDate, "yyyy-MM-dd")
      : null;
    const endStr = data.endDate ? format(data.endDate, "yyyy-MM-dd") : null;

    const urlWithParams = createUrl({
      location: data.location?.trim() ? data.location.trim() : null,
      capacity:
        data.capacity && data.capacity > 0 ? data.capacity.toString() : null,
      startDate: startStr,
      endDate: endStr,
    });

    if (pathname === ROUTES.USER.EXPLORE) {
      router.push(urlWithParams, { scroll: false });
    } else {
      const [, query] = urlWithParams.split("?");
      router.push(`${ROUTES.USER.EXPLORE}?${query || ""}`);
    }
  };

  // --- ARSENAL: Modo Compacto Interactivo (Para el Navbar) ---
  if (isCompact) {
    return (
      <Form
        form={form}
        onSubmit={onSubmit}
        className={clsx(
          "flex items-center bg-white rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all h-12 w-full max-w-sm mx-auto overflow-hidden pl-5 pr-1",
          className,
        )}
      >
        <div className="flex-1 min-w-0 h-full flex items-center">
          <Controller
            name="location"
            control={form.control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ""}
                placeholder="¿A dónde vas?"
                className="border-none bg-transparent shadow-none focus:ring-0 px-0 h-full text-sm font-medium w-full truncate text-slate-900 placeholder:text-slate-500"
              />
            )}
          />
        </div>

        <div className="w-px bg-slate-200 h-6 mx-2 shrink-0" />

        <div className="w-25 h-full flex items-center shrink-0">
          <Controller
            name="capacity"
            control={form.control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                min={1}
                value={field.value || ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                placeholder="Hués."
                className="border-none bg-transparent shadow-none focus:ring-0 px-0 h-full text-sm font-medium w-full text-center text-slate-900 placeholder:text-slate-500"
              />
            )}
          />
        </div>

        <Button
          type="submit"
          className="!rounded-full h-10 w-10 shrink-0 flex items-center justify-center p-0 ml-1"
          aria-label="Buscar"
        >
          <IoSearchOutline size={16} className="stroke-[2px]" />
        </Button>
      </Form>
    );
  }

  // --- ARSENAL: Modo Completo (Para el Hero Section) ---
  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      className={clsx(
        "flex flex-col md:flex-row items-center bg-white rounded-full border border-slate-200 shadow-md hover:shadow-lg transition-shadow divide-y md:divide-y-0 md:divide-x divide-slate-200 w-full max-w-4xl mx-auto overflow-hidden h-auto md:h-16",
        className,
      )}
    >
      <div className="flex-[1.5] w-full px-8 py-2 md:py-0 hover:bg-slate-50 transition-colors cursor-text focus-within:bg-slate-50 rounded-l-full flex items-center h-full">
        <Controller
          name="location"
          control={form.control}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value || ""}
              placeholder="¿A dónde vas?"
              className="border-none bg-transparent shadow-none focus:ring-0 px-0 h-full font-medium placeholder:text-slate-500 text-lg"
            />
          )}
        />
      </div>

      <div className="flex-1 flex w-full h-full hover:bg-slate-50 transition-colors focus-within:bg-slate-50 items-center">
        <div className="flex-1 px-4 py-2 md:py-0 h-full flex items-center">
          <Controller
            name="startDate"
            control={form.control}
            render={({ field }) => (
              <Input
                type="date"
                className="border-none bg-transparent shadow-none focus:ring-0 px-0 h-full text-sm text-slate-500 cursor-pointer w-full"
                value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? parseISO(e.target.value) : undefined,
                  )
                }
                onBlur={field.onBlur}
              />
            )}
          />
        </div>
        <div className="w-px bg-slate-200 h-8 self-center" />
        <div className="flex-1 px-4 py-2 md:py-0 h-full flex items-center">
          <Controller
            name="endDate"
            control={form.control}
            render={({ field }) => (
              <Input
                type="date"
                className="border-none bg-transparent shadow-none focus:ring-0 px-0 h-full text-sm text-slate-500 cursor-pointer w-full"
                value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? parseISO(e.target.value) : undefined,
                  )
                }
                onBlur={field.onBlur}
              />
            )}
          />
        </div>
      </div>

      <div className="flex-1 flex w-full items-center justify-between px-6 py-2 md:py-0 hover:bg-slate-50 transition-colors focus-within:bg-slate-50 rounded-r-full h-full gap-4">
        <div className="flex-1 w-16">
          <Controller
            name="capacity"
            control={form.control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                min={1}
                value={field.value || ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                placeholder="Huéspedes"
                className="border-none bg-transparent shadow-none focus:ring-0 px-0 h-full font-medium text-slate-900 placeholder:text-slate-500 text-lg w-full"
              />
            )}
          />
        </div>

        <button
          type="submit"
          className="bg-primary-600 text-white rounded-full h-10 w-10 shrink-0 flex items-center justify-center hover:bg-primary-700 transition-all shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 p-0 border-none cursor-pointer"
          aria-label="Buscar propiedades"
        >
          <IoSearchOutline size={20} className="stroke-[2.5px]" />
        </button>
      </div>
    </Form>
  );
}
