namespace Guestly.Application.DTOs.Reservations;

/// <summary>
/// Representa la request para actualizar el estado de una reserva, con una propiedad que indica el nuevo estado de la reserva.
/// </summary>
public record UpdateReservationStatusRequest()
{
    /// <summary>
    /// El nuevo estado de la reserva, representado como un entero que corresponde a un valor del enum ReservationStatus.
    /// </summary>
    public required int NewStatus { get; init; }
}
