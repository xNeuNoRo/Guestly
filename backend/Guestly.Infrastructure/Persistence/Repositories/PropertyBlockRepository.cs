using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Entities.Reservations;
using Microsoft.EntityFrameworkCore;

namespace Guestly.Infrastructure.Persistence.Repositories;

/// <summary>
/// Implementación concreta del repositorio de bloqueos de propiedades.
/// Gestiona la disponibilidad forzada por el anfitrión.
/// </summary>
public class PropertyBlockRepository : IPropertyBlockRepository
{
    private readonly AppDbContext _context;

    public PropertyBlockRepository(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Obtiene un bloqueo por su identificador único. Retorna null si no se encuentra.
    /// </summary>
    public async Task<PropertyBlock?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default
    )
    {
        return await _context.PropertyBlocks.FirstOrDefaultAsync(
            pb => pb.Id == id,
            cancellationToken
        );
    }

    /// <summary>
    /// Retorna los bloqueos que colisionan con un rango de fechas.
    /// </summary>
    public async Task<IEnumerable<PropertyBlock>> GetOverlappingBlocksAsync(
        Guid propertyId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken = default
    )
    {
        return await _context
            .PropertyBlocks.Where(pb =>
                pb.PropertyId == propertyId && pb.StartDate < endDate && pb.EndDate > startDate
            )
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Retorna los bloqueos futuros o en curso de una propiedad.
    /// </summary>
    public async Task<IEnumerable<PropertyBlock>> GetUpcomingBlocksByPropertyIdAsync(
        Guid propertyId,
        CancellationToken cancellationToken = default
    )
    {
        var currentTime = DateTime.UtcNow;

        return await _context
            .PropertyBlocks.Where(pb => pb.PropertyId == propertyId && pb.EndDate >= currentTime)
            .OrderBy(pb => pb.StartDate)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Verifica rápidamente (devuelve un bit) si existe colisión.
    /// </summary>
    public async Task<bool> HasOverlappingBlocksAsync(
        Guid propertyId,
        DateTime startDate,
        DateTime endDate,
        Guid? excludeBlockId = null,
        CancellationToken cancellationToken = default
    )
    {
        var query = _context.PropertyBlocks.Where(pb =>
            pb.PropertyId == propertyId && pb.StartDate < endDate && pb.EndDate > startDate
        );

        if (excludeBlockId.HasValue)
        {
            query = query.Where(pb => pb.Id != excludeBlockId.Value);
        }

        return await query.AnyAsync(cancellationToken);
    }

    /// <summary>
    /// Agrega un nuevo bloqueo a la base de datos. OJO: solo se guarda con el CommitAsync o SaveChangesAsync del Unit of Work.
    /// </summary>
    public async Task AddAsync(PropertyBlock block, CancellationToken cancellationToken = default)
    {
        await _context.PropertyBlocks.AddAsync(block, cancellationToken);
    }

    /// <summary>
    /// Marca un bloqueo existente como modificado para que se actualice en la base de datos.
    /// OJO: solo se guarda con el CommitAsync o SaveChangesAsync del Unit of Work.
    /// </summary>
    public void Update(PropertyBlock block)
    {
        _context.PropertyBlocks.Update(block);
    }

    /// <summary>
    /// Elimina un bloqueo de la base de datos.
    /// OJO: solo se borra con el CommitAsync o SaveChangesAsync del Unit of Work.
    /// </summary>
    public void Delete(PropertyBlock block)
    {
        _context.PropertyBlocks.Remove(block);
    }
}
