using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Entities.Reviews;
using Microsoft.EntityFrameworkCore;

namespace Guestly.Infrastructure.Persistence.Repositories;

/// <summary>
/// Implementación concreta del repositorio de reseñas utilizando Entity Framework Core.
/// Gestiona la persistencia de las calificaciones y comentarios de las propiedades.
/// </summary>
public class ReviewRepository : IReviewRepository
{
    private readonly AppDbContext _context;

    public ReviewRepository(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Obtiene una reseña por su identificador único. Retorna null si no se encuentra.
    /// </summary>
    public async Task<Review?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context
            .Reviews.Include(r => r.Property)
            .Include(r => r.Guest)
            .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
    }

    /// <summary>
    /// Obtiene una reseña asociada a una reserva específica. Retorna null si no se encuentra.
    /// </summary>
    public async Task<Review?> GetByReservationIdAsync(
        Guid reservationId,
        CancellationToken cancellationToken = default
    )
    {
        return await _context
            .Reviews.Include(r => r.Property)
            .Include(r => r.Guest)
            .FirstOrDefaultAsync(r => r.ReservationId == reservationId, cancellationToken);
    }

    /// <summary>
    /// Obtiene todas las reseñas escritas por un usuario (huésped) específico.
    /// Ordenadas desde la más reciente hasta la más antigua.
    /// </summary>
    public async Task<IEnumerable<Review>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        return await _context
            .Reviews.Include(r => r.Property)
            .Include(r => r.Guest)
            .Where(r => r.GuestId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Obtiene todas las reseñas asociadas a una propiedad específica.
    /// Ordenadas desde la más reciente hasta la más antigua para mostrar en el perfil de la propiedad.
    /// </summary>
    public async Task<IEnumerable<Review>> GetByPropertyIdAsync(
        Guid propertyId,
        CancellationToken cancellationToken = default
    )
    {
        return await _context
            .Reviews.Include(r => r.Guest)
            .Where(r => r.PropertyId == propertyId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Verifica rápidamente si ya existe una reseña para una reserva específica.
    /// </summary>
    public async Task<bool> ExistsByReservationIdAsync(
        Guid reservationId,
        CancellationToken cancellationToken = default
    )
    {
        return await _context.Reviews.AnyAsync(
            r => r.ReservationId == reservationId,
            cancellationToken
        );
    }

    /// <summary>
    /// Agrega una nueva reseña al Change Tracker de Entity Framework.
    /// OJO: solo se guarda en la base de datos con el CommitAsync del Unit of Work.
    /// </summary>
    public async Task AddAsync(Review review, CancellationToken cancellationToken = default)
    {
        await _context.Reviews.AddAsync(review, cancellationToken);
    }

    /// <summary>
    /// Marca una reseña como modificada para que sus cambios se guarden.
    /// OJO: solo se actualiza en la base de datos con el CommitAsync del Unit of Work.
    /// </summary>
    public void Update(Review review)
    {
        _context.Reviews.Update(review);
    }

    /// <summary>
    /// Marca una reseña para ser eliminada.
    /// OJO: solo se borra físicamente con el CommitAsync del Unit of Work.
    /// </summary>
    public void Delete(Review review)
    {
        _context.Reviews.Remove(review);
    }
}
