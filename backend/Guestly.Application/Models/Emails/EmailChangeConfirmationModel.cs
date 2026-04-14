namespace Guestly.Application.Models.Emails;

/// <summary>
/// Datos necesarios para renderizar la plantilla de confirmación de cambio de correo electrónico (EmailChangeConfirmation).
/// </summary>
public record EmailChangeConfirmationModel(
    string FirstName,
    string NewEmail,
    string ConfirmationLink
) : IEmailModel;
