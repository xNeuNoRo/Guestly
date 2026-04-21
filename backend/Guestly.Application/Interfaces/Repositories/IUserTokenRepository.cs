using Guestly.Domain.Entities.User;
using Guestly.Domain.Enums;

namespace Guestly.Application.Interfaces.Repositories;

public interface IUserTokenRepository
{
    // Permite obtener un token de usuario por su valor y tipo,
    // lo que es útil para validar tokens de autenticación o recuperación de contraseña
    Task<UserToken?> GetByTokenValueAsync(
        string token,
        TokenTypes type,
        CancellationToken cancellationToken = default
    );

    Task AddAsync(UserToken token, CancellationToken cancellationToken = default);

    // Elimina tokens existentes para un usuario y tipo específicos,
    // lo que es útil para invalidar tokens antiguos antes de generar nuevos
    Task RemoveExistingTokensAsync(
        Guid userId,
        TokenTypes type,
        CancellationToken cancellationToken = default
    );
}
