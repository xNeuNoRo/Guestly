import type { PropertySearchRequest } from "@/schemas/properties.schemas";
import type { ReservationSearchRequest } from "@/schemas/reservations.schemas";

// Este archivo define las query keys para las consultas con React Query
// Centraliza las keys para evitar errores tipográficos, facilitar la invalidación
// y mantener la estructura de la caché estricta y predecible.

// --- Query keys para Usuarios e Identidad ---
export const userKeys = {
  all: ["users"] as const,
  me: () => [...userKeys.all, "me"] as const,
  publicProfile: (id: string) => [...userKeys.all, "public", id] as const,
  hostDashboard: () => [...userKeys.all, "host-dashboard"] as const,
};

// --- Query keys para Propiedades ---
export const propertyKeys = {
  all: ["properties"] as const,
  searchBase: () => [...propertyKeys.all, "search"] as const, // Base para búsquedas sin params, útil para invalidar todas las búsquedas
  // Pasamos los params para que React Query cachee resultados diferentes según la búsqueda
  search: (params?: PropertySearchRequest) =>
    [...propertyKeys.all, "search", params] as const,
  detail: (id: string) => [...propertyKeys.all, "detail", id] as const,
  // La disponibilidad depende de la propiedad y del rango de fechas
  availability: (id: string, startDate: string, endDate: string) =>
    [...propertyKeys.detail(id), "availability", startDate, endDate] as const,
  byHost: () => [...propertyKeys.all, "host"] as const,
};

// --- Query keys para Reservas y Bloqueos ---
export const reservationKeys = {
  all: ["reservations"] as const,
  searchBase: () => [...reservationKeys.all, "search"] as const, // Base para búsquedas sin params, útil para invalidar todas las búsquedas
  search: (params?: ReservationSearchRequest) =>
    [...reservationKeys.all, "search", params] as const,
  detail: (id: string) => [...reservationKeys.all, "detail", id] as const,
  pricePreview: (propertyId: string, startDate: string, endDate: string) =>
    [
      ...reservationKeys.all,
      "price-preview",
      propertyId,
      startDate,
      endDate,
    ] as const,
  // Los bloqueos pertenecen a las reservas de una propiedad específica
  blocks: (propertyId: string) =>
    [...reservationKeys.all, "blocks", propertyId] as const,
};

// --- Query keys para Reseñas ---
export const reviewKeys = {
  all: ["reviews"] as const,
  detail: (id: string) => [...reviewKeys.all, "detail", id] as const,
  byReservation: (reservationId: string) =>
    [...reviewKeys.all, "reservation", reservationId] as const,
  byProperty: (propertyId: string) =>
    [...reviewKeys.all, "property", propertyId] as const,
  byUser: (userId: string) => [...reviewKeys.all, "user", userId] as const,
};

// --- Query keys para Notificaciones ---
export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "lists"] as const,
  unread: () => [...notificationKeys.lists(), "unread"] as const,
};
