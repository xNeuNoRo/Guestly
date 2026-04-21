namespace Guestly.Application.DTOs.Properties;

/// <summary>
/// Representa un rango de fechas con una fecha de inicio y una fecha de fin.
/// Este DTO se utiliza para representar un bloque de tiempo donde la propiedad
/// está reservada o no disponible para reservas.
/// </summary>
public record DateRangeResponse
{
    public required DateTime StartDate { get; init; }
    public required DateTime EndDate { get; init; }
}
