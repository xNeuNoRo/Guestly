namespace Guestly.Application.DTOs.Users;

/// <summary>
/// Representa la request para confirmar una nueva dirección de correo electrónico de un usuario,
/// incluyendo el nuevo correo electrónico que el usuario desea confirmar. Esta request se utiliza
/// después de que el usuario se haya registrado con un email equivocado y desee cambiarlo a uno correcto.
/// </summary>
public record UnconfirmedEmailRequest
{
    /// <summary>
    /// El nuevo correo electrónico del usuario que desea confirmar como su dirección de correo electrónico válida.
    /// </summary>
    public required string NewEmail { get; init; }
}
