using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Entities.User;
using Microsoft.EntityFrameworkCore;

namespace Guestly.Infrastructure.Persistence.Repositories;

/// <summary>
/// Implementación concreta del repositorio de usuarios utilizando Entity Framework Core.
/// Centraliza todas las operaciones de acceso a datos para la entidad User.
/// </summary>
public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Obtiene un usuario por su identificador único.
    /// </summary>
    public async Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
    }

    /// <summary>
    /// Obtiene un usuario por su dirección de correo electrónico.
    /// </summary>
    public async Task<User?> GetByEmailAsync(
        string email,
        CancellationToken cancellationToken = default
    )
    {
        var normalizedEmail = email.ToLowerInvariant();

        return await _context.Users.FirstOrDefaultAsync(
            u => u.Email == normalizedEmail,
            cancellationToken
        );
    }

    /// <summary>
    /// Verifica de manera ligera si ya existe un usuario con un correo electrónico específico.
    /// Ideal para la validación durante el registro sin cargar toda la entidad en memoria.
    /// </summary>
    public async Task<bool> ExistsByEmailAsync(
        string email,
        CancellationToken cancellationToken = default
    )
    {
        var normalizedEmail = email.ToLowerInvariant();

        return await _context.Users.AnyAsync(u => u.Email == normalizedEmail, cancellationToken);
    }

    /// <summary>
    /// Agrega un nuevo usuario al Change Tracker de Entity Framework.
    /// La persistencia real en la base de datos ocurre cuando se llama al UnitOfWork.CommitAsync().
    /// </summary>
    public async Task AddAsync(User user, CancellationToken cancellationToken = default)
    {
        await _context.Users.AddAsync(user, cancellationToken);
    }

    /// <summary>
    /// Marca la entidad de usuario como modificada en el Change Tracker.
    /// EF Core detectará automáticamente qué propiedades cambiaron al hacer el Commit.
    /// </summary>
    public void Update(User user)
    {
        _context.Users.Update(user);
    }
}
