"use client";

import { IoPeopleOutline, IoSparklesOutline } from "react-icons/io5";
import { formatCurrency } from "@/helpers/formatCurrency";
import type { PropertyResponse } from "@/schemas/properties.schemas";

interface PropertyStatsProps {
  property: PropertyResponse;
}

/**
 * @description Componente para mostrar la capacidad máxima y cargos fijos.
 * Utiliza los campos 'capacity' y 'cleaningFee' del DTO.
 */
export function PropertyStats({ property }: Readonly<PropertyStatsProps>) {
  const cleaningFeeFormatted = formatCurrency(property.cleaningFee);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-slate-200">
      {/* Capacidad */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
        <div className="p-2.5 bg-white rounded-lg shadow-sm text-slate-600">
          <IoPeopleOutline size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Capacidad</p>
          <p className="text-base font-bold text-slate-900">
            Hasta {property.capacity}{" "}
            {property.capacity === 1 ? "persona" : "personas"}
          </p>
        </div>
      </div>

      {/* Tarifa de Limpieza (Si existe) */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
        <div className="p-2.5 bg-white rounded-lg shadow-sm text-slate-600">
          <IoSparklesOutline size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">
            Gastos de limpieza
          </p>
          <p className="text-base font-bold text-slate-900">
            {property.cleaningFee > 0 ? cleaningFeeFormatted : "Gratis"}
          </p>
        </div>
      </div>
    </div>
  );
}
