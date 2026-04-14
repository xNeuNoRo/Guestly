using Guestly.Application.DTOs.Auth;
using Guestly.Domain.Enums;
using MediatR;

namespace Guestly.Application.Commands.Auth.Register;

/// <summary>
/// Comando para registrar un nuevo usuario. Contiene los datos necesarios para crear un nuevo usuario
/// en el sistema, incluyendo el nombre, apellido, correo electrónico, contraseña y rol del usuario.
/// </summary>
public record RegisterUserCommand(
    string FirstName,
    string LastName,
    string Email,
    string Password,
    UserRoles Role
) : IRequest<AuthResponse>;
