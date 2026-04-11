namespace Guestly.Application.DTOs.Properties;

/// <summary>
/// Representa la solicitud para buscar propiedades en el sistema.
/// Contiene criterios de búsqueda como ubicación, fechas de reserva, capacidad y rango de precios.
/// </summary>
public record PropertySearchRequest()
{
    /// <summary>
    /// La ubicación de la propiedad. Es un campo opcional que permite
    /// a los usuarios buscar propiedades en una ubicación específica.
    /// </summary>
    public string? Location { get; init; }

    /// <summary>
    /// La fecha de inicio de la reserva. Es un campo opcional que permite a
    /// los usuarios buscar propiedades disponibles a partir de una fecha específica.
    /// </summary>
    public DateTime? StartDate { get; init; }

    /// <summary>
    /// La fecha de fin de la reserva. Es un campo opcional que
    /// permite a los usuarios buscar propiedades disponibles hasta una fecha específica.
    /// </summary>
    public DateTime? EndDate { get; init; }

    /// <summary>
    /// La capacidad de la propiedad. Es un campo opcional que permite a los usuarios
    /// buscar propiedades que puedan alojar a un número específico de personas.
    /// </summary>
    public int? Capacity { get; init; }

    /// <summary>
    /// El precio mínimo de la propiedad. Es un campo opcional que permite a los usuarios
    /// buscar propiedades dentro de un rango de precios específico.
    /// </summary>
    public decimal? MinPrice { get; init; }

    /// <summary>
    /// El precio máximo de la propiedad. Es un campo opcional que permite a los usuarios
    /// buscar propiedades dentro de un rango de precios específico.
    /// </summary>
    public decimal? MaxPrice { get; init; }
}
