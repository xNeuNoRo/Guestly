// frontend/src/hooks/notifications/useNotificationRouting.ts
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import type { NotificationResponse } from "@/schemas/notifications.schemas";

export function useNotificationRouting() {
  const router = useRouter();

  const routeToOrigin = (notification: NotificationResponse) => {
    switch (notification.type) {
      case "ReservationRequested":
        // Es una solicitud entrante, lo enviamos al dashboard del host
        router.push(ROUTES.HOST.RESERVATIONS);
        break;
      case "ReservationConfirmed":
      case "ReservationCompleted":
        // Es la confirmación de un viaje propio, lo enviamos a sus viajes
        router.push(ROUTES.USER.RESERVATIONS);
        break;
      case "ReservationCancelled":
        // Heurística simple: Si el título incluye "huésped", es para el anfitrión.
        // De lo contrario, es el anfitrión cancelándole al huésped.
        if (notification.title.toLowerCase().includes("huésped")) {
          router.push(ROUTES.HOST.RESERVATIONS);
        } else {
          router.push(ROUTES.USER.RESERVATIONS);
        }
        break;
      case "System":
      default:
        break;
    }
  };

  return { routeToOrigin };
}
