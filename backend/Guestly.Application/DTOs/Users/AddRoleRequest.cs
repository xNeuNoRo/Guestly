using Guestly.Domain.Enums;

namespace Guestly.Application.DTOs.Users;

/// <summary>
/// Representa la request para agregar un rol a un usuario específico. Esta request incluye el rol
/// que se desea agregar al usuario, lo que puede afectar sus permisos y acceso a ciertas
/// funcionalidades dentro de la aplicación.
/// </summary>
public record AddRoleRequest()
{
    /// <summary>
    /// El rol que se desea agregar al usuario.
    /// </summary>
    public required UserRoles RoleToAdd { get; init; }
}
