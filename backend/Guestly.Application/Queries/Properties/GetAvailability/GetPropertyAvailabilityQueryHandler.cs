using Guestly.Application.DTOs.Properties;
using Guestly.Application.Interfaces.Repositories;
using MediatR;

namespace Guestly.Application.Queries.Properties.GetAvailability;

/// <summary>
/// Manejador para la consulta GetPropertyAvailabilityQuery, que obtiene la disponibilidad
/// de una propiedad en un rango de fechas específico.
/// </summary>
public class GetPropertyAvailabilityQueryHandler
    : IRequestHandler<GetPropertyAvailabilityQuery, IEnumerable<DateRangeResponse>>
{
    private readonly IReservationRepository _reservationRepository;
    private readonly IPropertyBlockRepository _propertyBlockRepository;

    public GetPropertyAvailabilityQueryHandler(
        IReservationRepository reservationRepository,
        IPropertyBlockRepository propertyBlockRepository
    )
    {
        _reservationRepository = reservationRepository;
        _propertyBlockRepository = propertyBlockRepository;
    }

    /// <summary>
    /// Maneja la consulta para obtener la disponibilidad de una propiedad, combinando las reservas y bloqueos
    /// que se superponen con el rango de fechas solicitado, y devuelve una lista de rangos de fechas no disponibles.
    /// </summary>
    public async Task<IEnumerable<DateRangeResponse>> Handle(
        GetPropertyAvailabilityQuery request,
        CancellationToken cancellationToken
    )
    {
        var unavailableRanges = new List<DateRangeResponse>();

        var overlappingReservations = await _reservationRepository.GetOverlappingReservationsAsync(
            request.PropertyId,
            request.StartDate,
            request.EndDate,
            cancellationToken
        );

        foreach (var res in overlappingReservations)
        {
            unavailableRanges.Add(
                new DateRangeResponse { StartDate = res.CheckInDate, EndDate = res.CheckOutDate }
            );
        }

        var overlappingBlocks = await _propertyBlockRepository.GetOverlappingBlocksAsync(
            request.PropertyId,
            request.StartDate,
            request.EndDate,
            cancellationToken
        );

        foreach (var block in overlappingBlocks)
        {
            unavailableRanges.Add(
                new DateRangeResponse { StartDate = block.StartDate, EndDate = block.EndDate }
            );
        }

        // Retornamos los bloqueos de tiempo ordenados cronológicamente
        return unavailableRanges.OrderBy(r => r.StartDate);
    }
}
