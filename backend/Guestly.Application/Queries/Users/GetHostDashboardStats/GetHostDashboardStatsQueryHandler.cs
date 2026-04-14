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
        var totalPropertiesTask = _propertyRepository.CountByHostIdAsync(
            request.HostId,
            cancellationToken
        );
        var totalReservationsTask = _reservationRepository.CountByHostIdAsync(
            request.HostId,
            null,
            cancellationToken
        );
        var pendingReservationsTask = _reservationRepository.CountByHostIdAsync(
            request.HostId,
            ReservationStatus.Pending,
            cancellationToken
        );
        var totalRevenueTask = _reservationRepository.GetTotalRevenueByHostIdAsync(
            request.HostId,
            cancellationToken
        );

        // Esperamos a que todas las tareas se completen simultáneamente antes de continuar
        await Task.WhenAll(
            totalPropertiesTask,
            totalReservationsTask,
            pendingReservationsTask,
            totalRevenueTask
        );

        return new HostDashboardStatsResponse
        {
            TotalProperties = await totalPropertiesTask,
            TotalReservations = await totalReservationsTask,
            PendingReservations = await pendingReservationsTask,
            TotalRevenue = await totalRevenueTask,
        };
    }
}
