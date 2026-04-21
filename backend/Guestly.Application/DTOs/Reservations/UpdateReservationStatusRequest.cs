using Guestly.Domain.Enums;

namespace Guestly.Application.DTOs.Reservations;

/// <summary>
/// Representa la request para actualizar el estado de una reserva, con una propiedad que indica el nuevo estado de la reserva.
/// </summary>
public record UpdateReservationStatusRequest()
{
    /// <summary>
    /// El nuevo estado de la reserva, que debe ser uno de los valores definidos en el enum ReservationStatus
    /// (Pending, Confirmed, Cancelled).
    /// </summary>
    public required ReservationStatus NewStatus { get; init; }
}
