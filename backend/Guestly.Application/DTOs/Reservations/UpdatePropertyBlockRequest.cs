namespace Guestly.Application.DTOs.Reservations;

public record UpdatePropertyBlockRequest
{
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
