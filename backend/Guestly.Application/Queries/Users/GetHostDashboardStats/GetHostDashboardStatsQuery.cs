using Guestly.Application.DTOs.Users;
using MediatR;

namespace Guestly.Application.Queries.Users.GetHostDashboardStats;

/// <summary>
/// Consulta para obtener las estadísticas del panel de control del anfitrión por su identificador.
/// </summary>
public record GetHostDashboardStatsQuery(Guid HostId) : IRequest<HostDashboardStatsResponse>;
