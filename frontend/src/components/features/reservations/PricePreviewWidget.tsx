"use client";

import { usePricePreview } from "@/hooks/reservations";
import { formatCurrency } from "@/helpers/formatCurrency";
import { Skeleton } from "@/components/shared/Skeleton";
import { IoInformationCircleOutline } from "react-icons/io5";

interface PricePreviewWidgetProps {
  propertyId: string;
  startDate?: string;
  endDate?: string;
}

export function PricePreviewWidget({
  propertyId,
  startDate,
  endDate,
}: Readonly<PricePreviewWidgetProps>) {
  const {
    data: preview,
    error,
    isLoading,
    isError,
  } = usePricePreview(propertyId, startDate, endDate);

  // Estado: No se han seleccionado fechas
  if (!startDate || !endDate) {
    return (
      <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center">
        <p className="text-sm text-slate-500">
          Selecciona fechas para ver el desglose de precio
        </p>
      </div>
    );
  }

  // Estado: Cargando datos del backend (.NET)
  if (isLoading) {
    return (
      <div className="space-y-3 py-4">
        <div className="flex justify-between">
          <Skeleton variant="text" className="w-1/2" />
          <Skeleton variant="text" className="w-1/4" />
        </div>
        <div className="flex justify-between">
          <Skeleton variant="text" className="w-1/3" />
          <Skeleton variant="text" className="w-1/4" />
        </div>
        <div className="flex justify-between">
          <Skeleton variant="text" className="w-1/4" />
          <Skeleton variant="text" className="w-1/4" />
        </div>
        <div className="pt-4 border-t border-slate-200 flex justify-between">
          <Skeleton variant="text" className="w-1/4 h-6" />
          <Skeleton variant="text" className="w-1/4 h-6" />
        </div>
      </div>
    );
  }

  // Estado: Error (Ej: La propiedad ya no está disponible o error de red)
  if (isError || !preview) {
    return (
      <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
        <IoInformationCircleOutline
          className="text-red-500 shrink-0 mt-0.5"
          size={18}
        />
        <p className="text-sm text-red-700">
          {error?.message ||
            "Hubo un problema calculando el precio. Intenta con otras fechas."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <h4 className="text-sm font-semibold text-slate-900">
        Desglose de precio
      </h4>

      <div className="space-y-3 text-sm text-slate-600">
        {/* Noches / Subtotal */}
        <div className="flex justify-between">
          <span className="underline decoration-slate-300 underline-offset-4">
            {formatCurrency(preview.pricePerNight)} x {preview.totalNights}{" "}
            noches
          </span>
          <span>{formatCurrency(preview.subtotal)}</span>
        </div>

        {/* Tarifa de Limpieza */}
        {preview.cleaningFee > 0 && (
          <div className="flex justify-between">
            <span className="underline decoration-slate-300 underline-offset-4">
              Tarifa de limpieza
            </span>
            <span>{formatCurrency(preview.cleaningFee)}</span>
          </div>
        )}

        {/* Tarifa de Servicio */}
        {preview.serviceFee > 0 && (
          <div className="flex justify-between">
            <span className="underline decoration-slate-300 underline-offset-4">
              Comisión de servicio Guestly
            </span>
            <span>{formatCurrency(preview.serviceFee)}</span>
          </div>
        )}

        {/* Impuestos */}
        {preview.taxes > 0 && (
          <div className="flex justify-between">
            <span className="underline decoration-slate-300 underline-offset-4">
              Impuestos
            </span>
            <span>{formatCurrency(preview.taxes)}</span>
          </div>
        )}
      </div>

      {/* Gran Total */}
      <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-slate-900 font-bold text-base">
        <span>Total</span>
        <span>{formatCurrency(preview.grandTotal)}</span>
      </div>

      <div className="p-3 bg-primary-50 rounded-lg flex items-center gap-2 text-primary-700">
        <IoInformationCircleOutline size={16} />
        <p className="text-xs font-medium">No se te cobrará nada todavía</p>
      </div>
    </div>
  );
}
