namespace Guestly.Domain.Enums;

/// <summary>
/// Enumeración que define los tipos de tokens utilizados en la aplicación, 
/// como tokens de confirmación de correo electrónico y tokens de restablecimiento de contraseña.. (Por ahora solo esos)
/// </summary>
public enum TokenTypes
{
    EmailConfirmation = 1,
    PasswordReset = 2,
}
