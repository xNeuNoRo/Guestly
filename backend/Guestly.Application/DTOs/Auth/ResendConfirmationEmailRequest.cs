using Guestly.Domain.Enums;

namespace Guestly.Application.DTOs.Auth;

/// <summary>
/// Representa la request para reenviar el correo de confirmación de cuenta a un
/// usuario que se ha registrado pero no ha confirmado su correo electrónico.
/// </summary>
public record ResendConfirmationEmailRequest
{
    /// <summary>
    /// La dirección de correo electrónico del usuario para el cual se desea reenviar el correo de confirmación.
    /// </summary>
    public required string Email { get; init; }

    /// <summary>
    /// Indica el flujo de verificación de correo electrónico, utilizado para
    /// diferenciar entre la verificación durante el registro y la verificación
    /// al cambiar el correo electrónico. Por defecto es Registration.
    /// </summary>
    public required EmailVerificationFlow Flow { get; init; } = EmailVerificationFlow.Registration;
}
