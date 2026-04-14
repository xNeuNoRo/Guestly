using Guestly.Application.DTOs.Reservations;
using MediatR;

namespace Guestly.Application.Queries.Reservations.GetPricePreview;

/// <summary>
/// Consulta para obtener una vista previa del precio de una reserva,
/// calculando el costo total basado en las fechas de check-in y check-out,
/// el precio por noche, y las tarifas adicionales como limpieza, servicio e impuestos.
/// </summary>
public record GetReservationPricePreviewQuery(Guid PropertyId, DateTime StartDate, DateTime EndDate)
    : IRequest<PricePreviewResponse>;
