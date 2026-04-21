using Guestly.Application.DTOs.Users;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Enums;
using MediatR;

namespace Guestly.Application.Queries.Users.GetHostDashboardStats;

/// <summary>
/// Manejador de la consulta para obtener las estadísticas del panel de control del anfitrión por su identificador.
/// </summary>
public class GetHostDashboardStatsQueryHandler
    : IRequestHandler<GetHostDashboardStatsQuery, HostDashboardStatsResponse>
{
    private readonly IPropertyRepository _propertyRepository;
    private readonly IReservationRepository _reservationRepository;

    public GetHostDashboardStatsQueryHandler(
        IPropertyRepository propertyRepository,
        IReservationRepository reservationRepository
    )
    {
        _propertyRepository = propertyRepository;
        _reservationRepository = reservationRepository;
    }

    /// <summary>
    /// Maneja la consulta para obtener las estadísticas del panel de control del anfitrión por su identificador.
    /// </summary>
    public async Task<HostDashboardStatsResponse> Handle(
        GetHostDashboardStatsQuery request,
        CancellationToken cancellationToken
    )
    {
        var totalPropertiesTask = await _propertyRepository.CountByHostIdAsync(
            request.HostId,
            cancellationToken
        );
        var totalReservationsTask = await _reservationRepository.CountByHostIdAsync(
            request.HostId,
            null,
            cancellationToken
        );
        var pendingReservationsTask = await _reservationRepository.CountByHostIdAsync(
            request.HostId,
            ReservationStatus.Pending,
            cancellationToken
        );
        var totalRevenueTask = await _reservationRepository.GetTotalRevenueByHostIdAsync(
            request.HostId,
            cancellationToken
        );

        return new HostDashboardStatsResponse
        {
            TotalProperties = totalPropertiesTask,
            TotalReservations = totalReservationsTask,
            PendingReservations = pendingReservationsTask,
            TotalRevenue = totalRevenueTask,
        };
    }
}
