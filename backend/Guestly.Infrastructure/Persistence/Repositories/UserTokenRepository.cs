using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Entities.User;
using Guestly.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Guestly.Infrastructure.Persistence.Repositories;

/// <summary>
/// Implementación concreta del repositorio de tokens de usuario utilizando Entity Framework Core.
/// Gestiona la persistencia y consulta de tokens de seguridad (confirmación, recuperación, etc.).
/// </summary>
public class UserTokenRepository : IUserTokenRepository
{
    private readonly AppDbContext _context;

    public UserTokenRepository(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Obtiene un token de usuario validando tanto su valor como su tipo.
    /// </summary>
    public async Task<UserToken?> GetByTokenValueAsync(
        string token,
        TokenTypes type,
        CancellationToken cancellationToken = default
    )
    {
        return await _context.UserTokens.FirstOrDefaultAsync(
            ut => ut.Token == token && ut.Type == type,
            cancellationToken
        );
    }

    /// <summary>
    /// Agrega un nuevo token al Change Tracker de Entity Framework.
    /// </summary>
    public async Task AddAsync(UserToken token, CancellationToken cancellationToken = default)
    {
        await _context.UserTokens.AddAsync(token, cancellationToken);
    }

    /// <summary>
    /// Elimina los tokens existentes en memoria para un usuario y tipo específicos.
    /// </summary>
    public async Task RemoveExistingTokensAsync(
        Guid userId,
        TokenTypes type,
        CancellationToken cancellationToken = default
    )
    {
        // Primero, obtenemos los tokens que coinciden con el usuario y el tipo.
        var tokensToRemove = await _context
            .UserTokens.Where(ut => ut.UserId == userId && ut.Type == type)
            .ToListAsync(cancellationToken);

        if (tokensToRemove.Any())
        {
            // Marcamos los tokens con el estado 'Deleted' en el Change Tracker.
            _context.UserTokens.RemoveRange(tokensToRemove);
        }
    }
}
