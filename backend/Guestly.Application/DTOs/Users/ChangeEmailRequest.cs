namespace Guestly.Application.DTOs.Users;

/// <summary>
/// Representa la request para cambiar la dirección de correo electrónico de un usuario,
/// incluyendo el nuevo correo electrónico y la contraseña del usuario para verificar su identidad.
/// </summary>
public record ChangeEmailRequest
{
    /// <summary>
    /// El nuevo correo electrónico del usuario que desea cambiar su dirección de correo electrónico.
    /// </summary>
    public required string NewEmail { get; init; }

    /// <summary>
    /// La contraseña del usuario que desea cambiar su dirección de correo electrónico,
    /// utilizada para verificar la identidad del usuario antes de realizar el cambio de correo electrónico.
    /// </summary>
    public required string Password { get; init; }
}
