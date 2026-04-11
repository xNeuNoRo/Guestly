namespace Guestly.Application.DTOs.Reservations;

/// <summary>
/// Representa la respuesta de una reserva, con propiedades como el identificador de la reserva,
/// el identificador de la propiedad reservada, el título de la propiedad, el identificador del huésped,
/// las fechas de inicio y fin de la reserva, el precio total, el estado de la reserva y la fecha de creación.
/// </summary>
public record ReservationResponse()
{
    /// <summary>
    /// El id de la reserva.
    /// </summary>
    public required Guid Id { get; init; }

    /// <summary>
    /// El id de la propiedad reservada.
    /// </summary>
    public required Guid PropertyId { get; init; }

    /// <summary>
    /// El título de la propiedad.
    /// </summary>
    public required string PropertyTitle { get; init; }

    /// <summary>
    /// La ubicación de la propiedad.
    /// </summary>
    public required string PropertyLocation { get; init; }

    /// <summary>
    /// La URL de la miniatura de la propiedad.
    /// </summary>
    public required string PropertyThumbnailUrl { get; init; }

    /// <summary>
    /// El id del huésped.
    /// </summary>
    public required Guid GuestId { get; init; }

    /// <summary>
    /// El nombre del huésped.
    /// </summary>
    public required string GuestName { get; init; }

    /// <summary>
    /// La fecha de inicio de la reserva.
    /// </summary>
    public required DateTime StartDate { get; init; }

    /// <summary>
    /// La fecha de finalización de la reserva.
    /// </summary>
    public required DateTime EndDate { get; init; }

    /// <summary>
    /// El precio por noche al momento de la reserva.
    /// </summary>
    public required decimal PricePerNightAtBooking { get; init; }

    /// <summary>
    /// El precio total de la reserva, calculado como el precio por noche multiplicado por el número de noches reservadas.
    /// </summary>
    public required decimal TotalPrice { get; init; }

    /// <summary>
    /// El estado de la reserva.
    /// </summary>
    public required int Status { get; init; }

    /// <summary>
    /// La fecha de creación de la reserva.
    /// </summary>
    public required DateTime CreatedAt { get; init; }
}
