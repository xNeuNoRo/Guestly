namespace Guestly.Application.DTOs.Users;

/// <summary>
/// Representa la request para restablecer la contraseña de un usuario,
/// incluyendo la dirección de correo electrónico del usuario,
/// el token de restablecimiento de contraseña enviado al correo electrónico del usuario,
/// y la nueva contraseña que el usuario desea establecer.
/// </summary>
public record ResetPasswordRequest
{
    /// <summary>
    /// La dirección de correo electrónico del usuario que desea restablecer su contraseña.
    /// </summary>
    public required string Email { get; init; }

    /// <summary>
    /// El token de restablecimiento de contraseña que se envió al correo electrónico del usuario,
    /// utilizado para verificar la autenticidad de la solicitud de restablecimiento de contraseña.
    /// </summary>
    public required string Token { get; init; }

    /// <summary>
    /// La nueva contraseña que el usuario desea establecer como su contraseña válida después de restablecerla.
    /// </summary>
    public required string NewPassword { get; init; }

    /// <summary>
    /// La confirmación de la nueva contraseña que el usuario desea establecer como su contraseña válida después de restablecerla,
    /// utilizada para verificar que el usuario ha ingresado correctamente la nueva contraseña.
    /// </summary>
    public required string ConfirmNewPassword { get; init; }
}
