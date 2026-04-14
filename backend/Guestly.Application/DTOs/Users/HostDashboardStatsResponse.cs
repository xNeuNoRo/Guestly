namespace Guestly.Application.DTOs.Users;

public record HostDashboardStatsResponse()
{
    /// <summary>
    /// El número total de propiedades del anfitrión.
    /// </summary>
    public required int TotalProperties { get; init; }

    /// <summary>
    /// El número total de reservas del anfitrión.
    /// </summary>
    public required int TotalReservations { get; init; }

    /// <summary>
    /// El número de reservas pendientes del anfitrión.
    /// </summary>
    public required int PendingReservations { get; init; }

    /// <summary>
    /// El ingreso total del anfitrión.
    /// </summary>
    public required decimal TotalRevenue { get; init; }
}
