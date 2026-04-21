using Guestly.Application.DTOs.Users;
using MediatR;

namespace Guestly.Application.Commands.Users.UpdateProfile;

/// <summary>
/// Comando para actualizar el perfil de un usuario. Contiene el identificador del usuario, el nuevo nombre y apellido
/// que el usuario desea establecer en su perfil. Al ejecutar este comando, se espera que el perfil del usuario sea actualizado
/// y se retorne una respuesta con la información actualizada del perfil del usuario.
/// </summary>
public record UpdateUserProfileCommand(Guid UserId, string FirstName, string LastName)
    : IRequest<UserProfileResponse>;
