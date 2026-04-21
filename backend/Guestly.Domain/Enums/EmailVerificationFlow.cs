namespace Guestly.Domain.Enums;

/// <summary>
/// Flujo de verificación de correo electrónico, utilizado para diferenciar 
/// entre la verificación durante el registro y la verificación al cambiar el correo electrónico.
/// </summary>
public enum EmailVerificationFlow
{
    Registration,
    ChangeEmail
}