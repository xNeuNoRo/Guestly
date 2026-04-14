using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Entities.Reservations;
using Guestly.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Guestly.Infrastructure.Persistence.Repositories;

/// <summary>
/// Implementación concreta del repositorio de reservas.
/// Centraliza la validación de disponibilidad y los cálculos financieros del anfitrión.
/// </summary>
public class ReservationRepository : IReservationRepository
{
    private readonly AppDbContext _context;

    public ReservationRepository(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Obtiene una reserva por su identificador único. Retorna null si no existe.
    /// </summary>
    public async Task<Reservation?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default
    )
    {
        return await _context.Reservations.FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
    }

    /// <summary>
    /// Obtiene las reservas que colisionan con un rango de fechas.
    /// Ignora inteligentemente las reservas Canceladas, ya que estas liberan el calendario.
    /// </summary>
    public async Task<IEnumerable<Reservation>> GetOverlappingReservationsAsync(
        Guid propertyId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default
    )
    {
        return await _context
            .Reservations.Where(r =>
                r.PropertyId == propertyId
                && r.Status != ReservationStatus.Cancelled
                && r.CheckInDate < endDate
                && r.CheckOutDate > startDate
            )
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Verifica rápidamente (devuelve un bit) si existe una colisión de fechas.
    /// Fundamental para el proceso de Checkout de una nueva reserva.
    /// </summary>
    public async Task<bool> HasOverlappingReservationsAsync(
        Guid propertyId,
        DateTime checkIn,
        DateTime checkOut,
        CancellationToken cancellationToken = default
    )
    {
        return await _context.Reservations.AnyAsync(
            r =>
                r.PropertyId == propertyId
                && r.Status != ReservationStatus.Cancelled
                && r.CheckInDate < checkOut
                && r.CheckOutDate > checkIn,
            cancellationToken
        );
    }

    /// <summary>
    /// Búsqueda dinámica de reservas (ej. para el panel de control del anfitrión o historial del huésped, 
    /// por ahora idk donde lo usare en el frontend).
    /// </summary>
    public async Task<IEnumerable<Reservation>> SearchAsync(
        Guid? propertyId,
        Guid? guestId,
        Guid? hostId,
        ReservationStatus? status,
        DateTime? startDate,
        DateTime? endDate,
        CancellationToken cancellationToken = default
    )
    {
        var query = _context.Reservations.AsQueryable();

        if (propertyId.HasValue)
        {
            query = query.Where(r => r.PropertyId == propertyId.Value);
        }

        if (guestId.HasValue)
        {
            query = query.Where(r => r.GuestId == guestId.Value);
        }

        // Navegamos a través de la propiedad para filtrar por anfitrión (EF Core hace un INNER JOIN en SQL)
        if (hostId.HasValue)
        {
            query = query.Where(r => r.Property!.HostId == hostId.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(r => r.Status == status.Value);
        }

        // Filtro por fechas, traemos las reservas que ocurran dentro del rango solicitado
        if (startDate.HasValue)
        {
            query = query.Where(r => r.CheckOutDate > startDate.Value);
        }

        if (endDate.HasValue)
        {
            query = query.Where(r => r.CheckInDate < endDate.Value);
        }

        // Ordenamos para que las reservas más recientes o próximas salgan primero
        return await query.OrderByDescending(r => r.CreatedAt).ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Cuenta las reservas de un anfitrión, útil para estadísticas del Dashboard.
    /// Puede filtrar opcionalmente por un estado específico (ej. "Pendientes").
    /// </summary>
    public async Task<int> CountByHostIdAsync(
        Guid hostId,
        ReservationStatus? status = null,
        CancellationToken cancellationToken = default
    )
    {
        var query = _context.Reservations.Where(r => r.Property!.HostId == hostId);

        if (status.HasValue)
        {
            query = query.Where(r => r.Status == status.Value);
        }

        return await query.CountAsync(cancellationToken);
    }

    /// <summary>
    /// Calcula el ingreso total histórico de un anfitrión sumando el precio total
    /// de las reservas que ya están Completadas.
    /// </summary>
    public async Task<decimal> GetTotalRevenueByHostIdAsync(
        Guid hostId,
        CancellationToken cancellationToken = default
    )
    {
        return await _context
            .Reservations.Where(r =>
                r.Property!.HostId == hostId && r.Status == ReservationStatus.Completed
            )
            .SumAsync(r => r.TotalPrice, cancellationToken);
    }

    /// <summary>
    /// Agrega una nueva reserva al Change Tracker.
    /// OJO: solo se guarda en base de datos con el CommitAsync del Unit of Work.
    /// </summary>
    public async Task AddAsync(
        Reservation reservation,
        CancellationToken cancellationToken = default
    )
    {
        await _context.Reservations.AddAsync(reservation, cancellationToken);
    }

    /// <summary>
    /// Marca una reserva como modificada (ej. al confirmar, cancelar o completar).
    /// OJO: solo impacta la base de datos con el CommitAsync del Unit of Work.
    /// </summary>
    public void Update(Reservation reservation)
    {
        _context.Reservations.Update(reservation);
    }
}
