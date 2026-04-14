namespace Guestly.Application.Models.Emails;

/// <summary>
/// Datos necesarios para notificar al usuario sobre una alerta de seguridad, como un cambio de contraseña o correo electrónico.
/// </summary>
public record SecurityAlertModel(
    string FirstName,
    string ActionPerformed, // Ej: "cambio de contraseña" o "cambio de correo"
    string Date // Fecha y hora del evento
);
