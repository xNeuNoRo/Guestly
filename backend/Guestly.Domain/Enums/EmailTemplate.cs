namespace Guestly.Domain.Enums;

/// <summary>
/// Define las plantillas de correo electrónico disponibles en el sistema.
/// Cada valor corresponde a un archivo físico de plantilla (ej. .cshtml o .html) en la infraestructura.
/// </summary>
public enum EmailTemplate
{
    /// <summary>
    /// Correo enviado justo después del registro para validar la propiedad de la cuenta.
    /// </summary>
    EmailConfirmation,

    /// <summary>
    /// Correo enviado para confirmar que el usuario ha solicitado un cambio de correo electrónico.
    /// </summary>
    EmailChangeConfirmation,

    /// <summary>
    /// Correo con el token o enlace para restablecer una contraseña olvidada.
    /// </summary>
    PasswordReset,

    /// <summary>
    /// Correo de alerta de seguridad para notificar al usuario sobre cambios importantes en su cuenta,
    /// como un cambio de contraseña o correo electrónico.
    /// </summary>
    SecurityAlert,

    /// <summary>
    /// Confirmación de que una reserva ha sido pagada y confirmada.
    /// </summary>
    ReservationConfirmed,

    /// <summary>
    /// Aviso de que una reserva ha sido cancelada (ya sea por el anfitrión o el huésped).
    /// </summary>
    ReservationCancelled,

    /// <summary>
    /// Correo de bienvenida o resumen cuando un usuario se convierte en anfitrión.
    /// </summary>
    WelcomeHost,
}
