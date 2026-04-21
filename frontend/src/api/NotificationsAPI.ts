import { handleApiError } from "@/helpers/handleApiError";
import { validateApiRes } from "@/helpers/validateApiRes";
import { api } from "@/lib/axios";
import {
  type NotificationResponse,
  notificationResponseSchema,
} from "@/schemas/notifications.schemas";

/**
 * @description Obtiene el historial completo de notificaciones del usuario.
 */
export const getAllNotifications = async (): Promise<
  NotificationResponse[]
> => {
  try {
    const { data } = await api.get("/notifications");
    return validateApiRes(data, notificationResponseSchema.array());
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Obtiene únicamente las notificaciones no leídas (para la campanita).
 */
export const getUnreadNotifications = async (): Promise<
  NotificationResponse[]
> => {
  try {
    const { data } = await api.get("/notifications/unread");
    return validateApiRes(data, notificationResponseSchema.array());
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Marca una notificación específica como leída.
 * @param id - ID de la notificación.
 */
export const markAsRead = async (id: string): Promise<void> => {
  try {
    await api.patch(`/notifications/${id}/read`);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Revierte una notificación al estado de "No Leída".
 * @param id - ID de la notificación.
 */
export const markAsUnread = async (id: string): Promise<void> => {
  try {
    await api.patch(`/notifications/${id}/unread`);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Marca todas las notificaciones del usuario como leídas.
 */
export const markAllAsRead = async (): Promise<void> => {
  try {
    await api.patch("/notifications/read-all");
  } catch (error) {
    handleApiError(error);
  }
};
