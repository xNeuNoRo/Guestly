using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Entities.Properties;
using Guestly.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Guestly.Infrastructure.Persistence.Repositories;

/// <summary>
/// Implementación concreta del repositorio de propiedades utilizando Entity Framework Core.
/// Gestiona la persistencia y consulta del inventario de los anfitriones.
/// </summary>
public class PropertyRepository : IPropertyRepository
{
    private readonly AppDbContext _context;

    public PropertyRepository(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Obtiene una propiedad por su identificador único.
    /// </summary>
    public async Task<Property?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default
    )
    {
        return await _context
            .Properties.Include(p => p.Reviews)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    /// <summary>
    /// Obtiene todas las propiedades registradas por un anfitrión específico.
    /// </summary>
    public async Task<IEnumerable<Property>> GetByHostIdAsync(
        Guid hostId,
        CancellationToken cancellationToken = default
    )
    {
        return await _context
            .Properties.Include(p => p.Host)
            .Include(p => p.Reviews)
            .Where(p => p.HostId == hostId)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Búsqueda dinámica de propiedades. Construye la consulta SQL paso a paso
    /// según los parámetros que no sean nulos.
    /// </summary>
    public async Task<IEnumerable<Property>> SearchAsync(
        string? location,
        DateTime? startDate,
        DateTime? endDate,
        int? capacity,
        decimal? minPrice,
        decimal? maxPrice,
        CancellationToken cancellationToken = default
    )
    {
        // AsQueryable nos permite construir la consulta de forma dinámica sin ejecutarla hasta el final.
        var query = _context.Properties.Include(p => p.Host).Include(p => p.Reviews).AsQueryable();

        // Filtro por ubicación (si se proporcionó)
        if (!string.IsNullOrWhiteSpace(location))
        {
            query = query.Where(p => p.Location.Contains(location));
        }

        // Filtro por capacidad mínima
        if (capacity.HasValue)
        {
            query = query.Where(p => p.Capacity >= capacity.Value);
        }

        // Filtros por rango de precio
        if (minPrice.HasValue)
        {
            query = query.Where(p => p.PricePerNight >= minPrice.Value);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(p => p.PricePerNight <= maxPrice.Value);
        }

        // Filtro por disponibilidad de fechas (El más complejo)
        if (startDate.HasValue && endDate.HasValue)
        {
            // La formula de solapamiento es: (Inicio A < Fin B) AND (Fin A > Inicio B)
            // Filtramos trayendo solo las propiedades que NO tengan solapamientos en Reservas ni en Bloqueos
            query = query.Where(p =>
                !p.Reservations.Any(r =>
                    r.Status != ReservationStatus.Cancelled
                    && // Ignoramos las canceladas
                    r.CheckInDate < endDate.Value // Fin A > Inicio B
                    && r.CheckOutDate > startDate.Value // Inicio A < Fin B
                ) && !p.Blocks.Any(b => b.StartDate < endDate.Value && b.EndDate > startDate.Value) // Ignoramos las propiedades que tengan bloqueos en esas fechas
            );
        }

        // Finalmente, ejecutamos la consulta construida contra la base de datos
        return await query.ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Cuenta de forma eficiente cuántas propiedades tiene un anfitrión.
    /// </summary>
    public async Task<int> CountByHostIdAsync(
        Guid hostId,
        CancellationToken cancellationToken = default
    )
    {
        return await _context.Properties.CountAsync(p => p.HostId == hostId, cancellationToken);
    }

    /// <summary>
    /// Agrega una nueva propiedad al Change Tracker de Entity Framework.
    /// </summary>
    public async Task AddAsync(Property property, CancellationToken cancellationToken = default)
    {
        await _context.Properties.AddAsync(property, cancellationToken);
    }

    /// <summary>
    /// Marca la entidad como modificada para que sus cambios se guarden en el próximo Commit.
    /// </summary>
    public void Update(Property property)
    {
        _context.Properties.Update(property);
    }

    /// <summary>
    /// Marca la entidad para ser eliminada de la base de datos en el próximo Commit.
    /// </summary>
    public void Delete(Property property)
    {
        _context.Properties.Remove(property);
    }
}
