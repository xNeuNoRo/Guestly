using MediatR;

namespace Guestly.Application.Commands.Users.ChangeEmail;

/// <summary>
/// Comando para cambiar el correo electrónico de un usuario. Contiene el identificador del usuario, el nuevo correo electrónico
/// que el usuario desea establecer, y la contraseña actual del usuario para validar la autenticidad de la solicitud. Al ejecutar este comando, se espera que el correo electrónico del usuario sea actualizado si la contraseña es correcta, y se retorne
/// un valor booleano indicando si el cambio de correo electrónico fue exitoso o no.
/// </summary>
public record ChangeEmailCommand(Guid UserId, string NewEmail, string Password) : IRequest<bool>;
