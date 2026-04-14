namespace Guestly.Application.Models.Emails;

/// <summary>
/// Datos necesarios para renderizar el recibo y confirmación de una reserva (ReservationConfirmed).
/// </summary>
public record ReservationConfirmedModel(
    string GuestName,
    string PropertyTitle,
    string PropertyLocation,
    DateTime CheckInDate,
    DateTime CheckOutDate,
    string ReservationId,
    decimal TotalPrice,
    string HostName,
    string PropertyImageUrl // Para darle un toque visual al correo
) : IEmailModel;
