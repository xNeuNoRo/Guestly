namespace Guestly.Application.Models.Emails;

/// <summary>
/// Datos necesarios para notificar la cancelación de una reserva (ReservationCancelled).
/// </summary>
public record ReservationCancelledModel(
    string UserName, // Puede ser el huésped o el anfitrión, dependiendo de a quién se le envíe
    string PropertyTitle,
    DateTime CheckInDate,
    DateTime CheckOutDate,
    string ReservationId
);
