namespace Guestly.Application.DTOs.Reservations;

/// <summary>
/// Representa la request para crear una nueva reserva, con propiedades como el
/// identificador de la propiedad a reservar, las fechas de inicio y fin de la reserva.
/// </summary>
public record CreateReservationRequest()
{
    /// <summary>
    /// El id de la propiedad que desea reservar el usuario.
    /// </summary>
    public required Guid PropertyId { get; init; }

    /// <summary>
    /// La fecha de inicio de la reserva.
    /// </summary>
    public required DateTime StartDate { get; init; }

    /// <summary>
    /// La fecha de finalización de la reserva.
    /// </summary>
    public required DateTime EndDate { get; init; }
}
