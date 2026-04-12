namespace Guestly.Application.DTOs.Reservations;

/// <summary>
/// Representa la respuesta para un bloque de propiedad, con propiedades como el
/// identificador del bloque, el identificador de la propiedad bloqueada, las fechas de inicio y fin del bloqueo,
/// la razón del bloqueo (opcional) y la fecha de creación del bloqueo.
/// </summary>
public record PropertyBlockResponse
{
    /// <summary>
    /// El id del bloque de propiedad.
    /// </summary>
    public required Guid Id { get; init; }

    /// <summary>
    /// El id de la propiedad bloqueada.
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

    /// <summary>
    /// La fecha de creación del bloqueo.
    /// </summary>
    public required DateTime CreatedAt { get; init; }
}
