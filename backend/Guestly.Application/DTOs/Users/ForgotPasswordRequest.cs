namespace Guestly.Application.DTOs.Users;

/// <summary>
/// Representa la request para solicitar el restablecimiento de la contraseña de un usuario que ha olvidado su contraseña,
/// incluyendo la dirección de correo electrónico del usuario para enviar el token de restablecimiento de contraseña
/// a esa dirección de correo electrónico. Esta request se utiliza para iniciar el proceso de restablecimiento de contraseña
/// cuando un usuario ha olvidado su contraseña y desea restablecerla.
/// </summary>
public record ForgotPasswordRequest
{
    /// <summary>
    /// La dirección de correo electrónico del usuario que ha olvidado su contraseña y desea restablecerla.
    /// </summary>
    public required string Email { get; init; }
}