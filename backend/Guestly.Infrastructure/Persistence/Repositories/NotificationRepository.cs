using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Entities.Notifications;
using Microsoft.EntityFrameworkCore;

namespace Guestly.Infrastructure.Persistence.Repositories;

/// <summary>
/// Implementación concreta del repositorio de notificaciones utilizando Entity Framework Core.
/// Gestiona la bandeja de entrada y las alertas del sistema para los usuarios.
/// </summary>
public class NotificationRepository : INotificationRepository
{
    private readonly AppDbContext _context;

    public NotificationRepository(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Obtiene una notificación por su identificador único. Retorna null si no se encuentra.
    /// </summary>
    public async Task<Notification?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default
    )
    {
        return await _context.Notifications.FirstOrDefaultAsync(n => n.Id == id, cancellationToken);
    }

    /// <summary>
    /// Obtiene todas las notificaciones de un usuario, ordenadas desde la más reciente a la más antigua.
    /// </summary>
    public async Task<IEnumerable<Notification>> GetAllByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        return await _context
            .Notifications.Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Obtiene solo las notificaciones no leídas de un usuario.
    /// </summary>
    public async Task<IEnumerable<Notification>> GetUnreadByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        return await _context
            .Notifications.Where(n => n.UserId == userId && !n.IsRead)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Agrega una nueva notificación al Change Tracker de Entity Framework.
    /// OJO: solo se guarda en la base de datos con el CommitAsync o SaveChangesAsync del Unit of Work.
    /// </summary>
    public async Task AddAsync(
        Notification notification,
        CancellationToken cancellationToken = default
    )
    {
        await _context.Notifications.AddAsync(notification, cancellationToken);
    }

    /// <summary>
    /// Marca una notificación como modificada (ej. al usar el método MarkAsRead del dominio).
    /// OJO: solo se actualiza en la base de datos con el CommitAsync o SaveChangesAsync del Unit of Work.
    /// </summary>
    public void Update(Notification notification)
    {
        _context.Notifications.Update(notification);
    }
}
