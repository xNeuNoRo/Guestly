using Guestly.Application.DTOs.Properties;
using MediatR;

namespace Guestly.Application.Queries.Properties.GetAvailability;

/// <summary>
/// Representa una consulta para obtener la disponibilidad de una propiedad en un rango de fechas específico.
/// Esta consulta se utiliza para verificar qué fechas dentro del rango solicitado están reservadas o no disponibles para reservas,
/// lo que permite a los usuarios planificar sus viajes de manera efectiva y evitar conflictos de reserva.
/// </summary>
public record GetPropertyAvailabilityQuery(Guid PropertyId, DateTime StartDate, DateTime EndDate)
    : IRequest<IEnumerable<DateRangeResponse>>;
