"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { format, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import {
  IoTrashOutline,
  IoCalendarOutline,
  IoLockClosedOutline,
  IoPencilOutline,
  IoCloseOutline,
} from "react-icons/io5";
import type { DateRange, Matcher } from "react-day-picker";

import { Calendar } from "@/components/shared/Calendar";
import { Button } from "@/components/shared/Button";
import { Form } from "@/components/shared/form/Form";
import { InputField } from "@/components/shared/form/InputField";
import { Skeleton } from "@/components/shared/Skeleton";

import {
  createPropertyBlockSchema,
  type CreatePropertyBlockRequest,
  type PropertyBlockResponse,
} from "@/schemas/reservations.schemas";
import { usePropertyBlocks } from "@/hooks/reservations/useQueries";
import {
  useCreatePropertyBlock,
  useDeletePropertyBlock,
  useUpdatePropertyBlock,
} from "@/hooks/reservations/useMutation";
import { useQueryString } from "@/hooks/shared/useQueryString";

interface PropertyBlockManagerProps {
  propertyId: string;
}

const getSafeLocalDate = (value?: string | Date | null): Date | undefined => {
  if (!value) return undefined;

  let dateString = "";

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return undefined;
    dateString = value.toISOString().split("T")[0];
  } else if (typeof value === "string") {
    dateString = value.split("T")[0];
  } else {
    return undefined;
  }

  const [year, month, day] = dateString.split("-").map(Number);
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day))
    return undefined;

  return new Date(year, month - 1, day);
};

export function PropertyBlockManager({
  propertyId,
}: Readonly<PropertyBlockManagerProps>) {
  const router = useRouter();
  const { createUrl, searchParams } = useQueryString();

  const deletingId = searchParams.get("deletingBlock");
  const editingId = searchParams.get("editingBlock");
  const urlStart = searchParams.get("blockStart");
  const urlEnd = searchParams.get("blockEnd");

  const { data: blocks, isLoading: isLoadingBlocks } =
    usePropertyBlocks(propertyId);
  const { mutate: createBlock, isPending: isCreating } =
    useCreatePropertyBlock();
  const { mutate: updateBlock, isPending: isUpdating } =
    useUpdatePropertyBlock();
  const { mutate: deleteBlock, isPending: isDeleting } =
    useDeletePropertyBlock();

  const form = useForm<CreatePropertyBlockRequest>({
    resolver: zodResolver(createPropertyBlockSchema),
    defaultValues: {
      propertyId,
      reason: "",
      startDate: undefined,
      endDate: undefined,
    },
  });

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  useEffect(() => {
    const currentStart = form.getValues("startDate");
    const currentEnd = form.getValues("endDate");

    const newStart = getSafeLocalDate(urlStart);
    if (newStart) {
      if (currentStart?.getTime() !== newStart.getTime()) {
        form.setValue("startDate", newStart, { shouldValidate: true });
      }
    } else if (currentStart) {
      form.setValue("startDate", undefined as unknown as Date);
    }

    const newEnd = getSafeLocalDate(urlEnd);
    if (newEnd) {
      if (currentEnd?.getTime() !== newEnd.getTime()) {
        form.setValue("endDate", newEnd, { shouldValidate: true });
      }
    } else if (currentEnd) {
      form.setValue("endDate", undefined as unknown as Date);
    }
  }, [urlStart, urlEnd, form]);

  const disabledDays = useMemo<Matcher[]>(() => {
    const disabled: Matcher[] = [{ before: startOfDay(new Date()) }];
    blocks?.forEach((block) => {
      if (block.id !== editingId) {
        const start = getSafeLocalDate(block.startDate);
        const end = getSafeLocalDate(block.endDate);
        if (start && end) {
          disabled.push({
            from: startOfDay(start),
            to: startOfDay(end),
          });
        }
      }
    });
    return disabled;
  }, [blocks, editingId]);

  const resetUrlState = () => {
    router.push(
      createUrl({ blockStart: null, blockEnd: null, editingBlock: null }),
      { scroll: false },
    );
  };

  const clearForm = () => {
    // Forzar el vaciado explícito para que el DOM reaccione
    form.setValue("reason", "");
    form.setValue("startDate", undefined as unknown as Date);
    form.setValue("endDate", undefined as unknown as Date);

    form.reset({
      propertyId,
      reason: "",
      startDate: undefined as unknown as Date,
      endDate: undefined as unknown as Date,
    });
    resetUrlState();
  };

  const onSubmit = (data: CreatePropertyBlockRequest) => {
    console.log("Submitting form with data:", data);
    if (editingId) {
      updateBlock(
        {
          id: editingId,
          request: data,
        },
        {
          onSuccess: () => {
            clearForm();
          },
        },
      );
    } else {
      createBlock(
        { propertyId, request: { ...data, propertyId } },
        {
          onSuccess: () => {
            clearForm();
          },
        },
      );
    }
  };

  const handleEdit = (block: PropertyBlockResponse) => {
    // Inyectamos el valor explícitamente al editar
    form.setValue("reason", block.reason || "");

    const start = getSafeLocalDate(block.startDate);
    const end = getSafeLocalDate(block.endDate);

    router.push(
      createUrl({
        editingBlock: block.id,
        blockStart: start ? format(start, "yyyy-MM-dd") : null,
        blockEnd: end ? format(end, "yyyy-MM-dd") : null,
      }),
      { scroll: false },
    );
  };

  const handleCancelEdit = () => {
    clearForm();
  };

  const handleDelete = (blockId: string) => {
    router.push(createUrl({ deletingBlock: blockId }), { scroll: false });
    deleteBlock(
      { id: blockId, propertyId },
      {
        onSuccess: () =>
          router.push(createUrl({ deletingBlock: null }), { scroll: false }),
        onError: () =>
          router.push(createUrl({ deletingBlock: null }), { scroll: false }),
      },
    );
  };

  const blocksContent = (() => {
    if (isLoadingBlocks) {
      return (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-20 rounded-xl" />
          ))}
        </div>
      );
    }

    if (!blocks?.length) {
      return (
        <div className="text-center py-10 px-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-medium">
          No tienes fechas bloqueadas actualmente.
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3 max-h-125 overflow-y-auto pr-2">
        {blocks.map((block: PropertyBlockResponse) => {
          const start = getSafeLocalDate(block.startDate);
          const end = getSafeLocalDate(block.endDate);
          if (!start || !end) return null;

          const dateString =
            start.getMonth() === end.getMonth()
              ? `${format(start, "d")} - ${format(end, "d 'de' MMMM", { locale: es })}`
              : `${format(start, "d 'de' MMM", { locale: es })} - ${format(end, "d 'de' MMM", { locale: es })}`;

          const isBeingEdited = editingId === block.id;

          return (
            <div
              key={block.id}
              className={`flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm transition-colors ${
                isBeingEdited
                  ? "border-primary-500 ring-1 ring-primary-500"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-slate-900 capitalize">
                  {dateString}
                </p>
                <p className="text-sm text-slate-500">
                  {block.reason || "Sin motivo especificado"}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(block)}
                  disabled={isDeleting || isBeingEdited}
                  className="text-slate-400 hover:text-primary-600 hover:bg-primary-50"
                >
                  <IoPencilOutline size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(block.id)}
                  isLoading={isDeleting && deletingId === block.id}
                  disabled={isDeleting || isBeingEdited}
                  className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                >
                  {!(isDeleting && deletingId === block.id) && (
                    <IoTrashOutline size={20} />
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  })();

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="w-full lg:w-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm shrink-0">
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          {editingId ? "Editar Bloqueo" : "Bloquear Fechas"}
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          {editingId
            ? "Modifica las fechas o el motivo de este bloqueo."
            : "Selecciona un rango para evitar nuevas reservas."}
        </p>

        <Form form={form} onSubmit={onSubmit} className="flex flex-col gap-6">
          <Controller
            name="startDate"
            control={form.control}
            render={() => (
              <div className="flex flex-col gap-2">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 w-full">
                  <Calendar
                    mode="range"
                    selected={{ from: startDate, to: endDate }}
                    onSelect={(range: DateRange | undefined) => {
                      router.push(
                        createUrl({
                          blockStart: range?.from
                            ? format(range.from, "yyyy-MM-dd")
                            : null,
                          blockEnd: range?.to
                            ? format(range.to, "yyyy-MM-dd")
                            : null,
                        }),
                        { scroll: false },
                      );
                    }}
                    disabled={disabledDays}
                    numberOfMonths={1}
                  />
                </div>
              </div>
            )}
          />

          <div className="space-y-4">
            {/* Control explícito para blindar la actualización y envío del input */}
            <Controller
              name="reason"
              control={form.control}
              render={({ field }) => (
                <InputField
                  name={field.name}
                  value={field.value || ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  label="Motivo (Opcional)"
                  placeholder="Ej: Mantenimiento, Uso personal..."
                />
              )}
            />

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                className="w-full"
                disabled={!startDate || !endDate}
                isLoading={isCreating || isUpdating}
                leftIcon={
                  editingId ? <IoPencilOutline /> : <IoLockClosedOutline />
                }
              >
                {editingId ? "Guardar cambios" : "Confirmar bloqueo"}
              </Button>

              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  leftIcon={<IoCloseOutline />}
                >
                  Cancelar edición
                </Button>
              )}
            </div>
          </div>
        </Form>
      </div>

      <div className="flex-1 w-full bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <IoCalendarOutline className="text-slate-500" />
          Bloqueos Activos
        </h3>
        {blocksContent}
      </div>
    </div>
  );
}
