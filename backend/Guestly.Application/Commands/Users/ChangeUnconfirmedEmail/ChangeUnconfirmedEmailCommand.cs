using MediatR;

namespace Guestly.Application.Commands.Users.ChangeUnconfirmedEmail;

/// <summary>
/// Comando para cambiar el correo electrónico no confirmado de un usuario.
/// </summary>
public record ChangeUnconfirmedEmailCommand(Guid UserId, string NewEmail) : IRequest<bool>;
