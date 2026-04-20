"use client";

import type { ComponentProps } from "react";
import {
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoCloseCircleOutline,
  IoFlagOutline,
} from "react-icons/io5";
import { Badge } from "@/components/shared/Badge";
import type { ReservationStatus } from "@/schemas/reservations.schemas";

type BadgeVariant = NonNullable<ComponentProps<typeof Badge>["variant"]>;

interface ReservationStatusBadgeProps {
  status: ReservationStatus;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * @description Indicador visual para el estado de una reserva.
 * Mapea el enum del backend (ReservationStatus) a variantes semánticas del átomo Badge.
 */
export function ReservationStatusBadge({
  status,
  className,
  size = "sm",
}: Readonly<ReservationStatusBadgeProps>) {
  // Mapeo exhaustivo de los estados a sus propiedades visuales
  const getBadgeConfig = (
    status: ReservationStatus,
  ): { label: string; variant: BadgeVariant; icon: React.ReactNode } => {
    switch (status) {
      case "Pending":
        return {
          label: "Pendiente",
          variant: "warning",
          icon: <IoTimeOutline className="mr-1" />,
        };
      case "Confirmed":
        return {
          label: "Confirmada",
          variant: "success",
          icon: <IoCheckmarkCircleOutline className="mr-1" />,
        };
      case "Cancelled":
        return {
          label: "Cancelada",
          variant: "danger",
          icon: <IoCloseCircleOutline className="mr-1" />,
        };
      case "Completed":
        return {
          label: "Completada",
          variant: "neutral",
          icon: <IoFlagOutline className="mr-1" />,
        };
      default:
        return {
          label: status,
          variant: "neutral",
          icon: null,
        };
    }
  };

  const config = getBadgeConfig(status);
  const badgeSize = size === "lg" ? "md" : size;

  return (
    <Badge variant={config.variant} size={badgeSize} className={className}>
      <div className="flex items-center">
        {config.icon}
        <span>{config.label}</span>
      </div>
    </Badge>
  );
}
