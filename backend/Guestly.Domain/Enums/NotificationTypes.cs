namespace Guestly.Domain.Enums;

public enum NotificationTypes
{
    System = 1, // Notificaciones del sistema, como actualizaciones de la aplicación o mantenimiento programado

    // Bloque de notificaciones relacionadas con reservas
    ReservationRequested = 2, // Notificación para el anfitrión cuando un huésped solicita una reserva
    ReservationConfirmed = 3, // Notificación para el huésped cuando su reserva ha sido confirmada por el anfitrión
    ReservationCancelled = 4, // Notificación para el huésped y el anfitrión cuando una reserva ha sido cancelada
    ReservationCompleted = 5, // Notificación para el huésped y el anfitrión cuando una reserva ha sido completada
}
