using Guestly.Application.DTOs.Properties;
using MediatR;

namespace Guestly.Application.Commands.Properties.Search;

/// <summary>
/// Registro que representa una consulta para buscar propiedades en la aplicación, con parámetros opcionales
/// que permiten filtrar los resultados según la ubicación, fechas de disponibilidad, capacidad y rango de precios.
/// </summary>
public record PropertySearchQuery(
    string? Location,
    DateTime? StartDate,
    DateTime? EndDate,
    int? Capacity,
    decimal? MinPrice,
    decimal? MaxPrice
) : IRequest<IEnumerable<PropertyResponse>>;
