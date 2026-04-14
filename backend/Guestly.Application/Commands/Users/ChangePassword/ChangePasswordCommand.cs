using MediatR;

namespace Guestly.Application.Commands.Users.ChangePassword;

/// <summary>
/// Comando para cambiar la contraseña de un usuario. Este comando requiere el ID del usuario,
/// la contraseña actual y la nueva contraseña. El resultado es un booleano que indica
/// si el cambio de contraseña fue exitoso o no.
/// </summary>
public record ChangePasswordCommand(Guid UserId, string CurrentPassword, string NewPassword)
    : IRequest<bool>;
