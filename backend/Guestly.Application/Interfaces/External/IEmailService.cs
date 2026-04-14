using Guestly.Domain.Enums;

namespace Guestly.Application.Interfaces.External;

/// <summary>
/// Abstracción para el envío de correos electrónicos transaccionales.
/// </summary>
public interface IEmailService
{
    /// <summary>
    /// Envía un correo electrónico utilizando una plantilla predefinida y un modelo de datos fuertemente tipado.
    /// </summary>
    /// <typeparam name="T">El tipo del modelo de datos que se pasará a la plantilla (ej. ConfirmEmailModel).</typeparam>
    /// <param name="toEmail">El correo del destinatario.</param>
    /// <param name="subject">El asunto del correo.</param>
    /// <param name="template">El identificador de la plantilla a utilizar.</param>
    /// <param name="model">El objeto con los datos dinámicos para rellenar la plantilla (ej. Nombres, Tokens, URLs).</param>
    /// <param name="cancellationToken">Token de cancelación.</param>
    /// <returns>True si el correo fue enviado exitosamente; de lo contrario, False.</returns>
    Task<bool> SendTemplateEmailAsync<T>(
        string toEmail,
        string subject,
        EmailTemplate template,
        T model,
        CancellationToken cancellationToken = default
    );
}
