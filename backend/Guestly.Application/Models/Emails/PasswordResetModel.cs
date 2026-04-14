namespace Guestly.Application.Models.Emails;

/// <summary>
/// Datos necesarios para renderizar la plantilla de restablecimiento de contraseña (PasswordReset).
/// </summary>
public record PasswordResetModel(
    string FirstName,
    string ResetLink,
    // Util para informar al usuario que el enlace expirará después de cierto tiempo,
    // aunque la lógica de expiración real se maneje en otro lugar.
    int ExpirationMinutes = 15
) : IEmailModel;
