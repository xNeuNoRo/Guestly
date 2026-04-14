using Guestly.Application.DTOs.Reservations;
using Guestly.Domain.Enums;
using MediatR;

namespace Guestly.Application.Queries.Reservations.Search;

/// <summary>
/// Query para buscar reservas en el sistema, con filtros opcionales por propiedad, estado y rango de fechas.
/// </summary>
public record ReservationSearchQuery(
    Guid? PropertyId,
    Guid? GuestId,
    Guid? HostId,
    ReservationStatus? Status,
    DateTime? StartDate,
    DateTime? EndDate
) : IRequest<IEnumerable<ReservationResponse>>;
