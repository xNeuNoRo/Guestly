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
    /// Correo con el token o enlace para restablecer una contraseña olvidada.
    /// </summary>
    PasswordReset,

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
