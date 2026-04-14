namespace Guestly.Application.DTOs.Reservations;

/// <summary>
/// Representa la solicitud para crear un bloque de propiedad, con propiedades como el identificador de la propiedad a bloquear,
/// las fechas de inicio y fin del bloqueo, y una razón opcional para el bloqueo.
/// </summary>
public record CreatePropertyBlockRequest
{
    /// <summary>
    /// El id de la propiedad a bloquear.
    /// </summary>
    public required Guid PropertyId { get; init; }

    /// <summary>
    /// La fecha de inicio del bloqueo.
    /// </summary>
    public required DateTime StartDate { get; init; }

    /// <summary>
    /// La fecha de fin del bloqueo.
    /// </summary>
    public required DateTime EndDate { get; init; }

    /// <summary>
    /// La razón del bloqueo (opcional).
    /// </summary>
    public string? Reason { get; init; }
}
