using Guestly.Application.DTOs.Auth;
using Guestly.Domain.Enums;
using MediatR;

namespace Guestly.Application.Commands.Users.AddRole;

/// <summary>
/// Comando para agregar un rol a un usuario específico. Este comando se utiliza para asignar un nuevo rol a un
/// usuario existente en la aplicación, lo que puede afectar sus permisos y acceso a ciertas funcionalidades.
/// </summary>
public record AddRoleCommand(Guid UserId, UserRoles RoleToAdd) : IRequest<AuthResponse>;
