namespace Guestly.Application.Models.Emails;

/// <summary>
/// Datos necesarios para renderizar la plantilla de confirmación de correo electrónico (EmailConfirmation).
/// </summary>
public record ConfirmEmailModel(string FirstName, string ConfirmationLink);
