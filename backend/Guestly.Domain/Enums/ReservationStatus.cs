namespace Guestly.Domain.Enums;

/// <summary>
/// Enumeración que define los posibles estados de una reserva en la aplicación,
/// como pendiente, confirmada, cancelada y completada.
/// </summary>
public enum ReservationStatus
{
    Pending = 1, // Estado inicial de una reserva
    Confirmed = 2, // Estado que indica que la reserva ha sido confirmada por el anfitrión
    Cancelled = 3, // Estado que indica que la reserva ha sido cancelada por el huésped o el anfitrión
    Completed = 4, // Estado que indica que la reserva ha sido completada
}
