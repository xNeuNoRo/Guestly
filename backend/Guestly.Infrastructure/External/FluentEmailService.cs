using FluentEmail.Core;
using Guestly.Application.Interfaces.External;
using Guestly.Application.Models.Emails;
using Guestly.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace Guestly.Infrastructure.External;

/// <summary>
/// Implementación del servicio de correos electrónicos utilizando FluentEmail y Razor Templates.
/// </summary>
public class FluentEmailService : IEmailService
{
    private readonly IFluentEmailFactory _emailFactory;
    private readonly ILogger<FluentEmailService> _logger;

    public FluentEmailService(IFluentEmailFactory emailFactory, ILogger<FluentEmailService> logger)
    {
        _emailFactory = emailFactory;
        _logger = logger;
    }

    public async Task<bool> SendTemplateEmailAsync<T>(
        string toEmail,
        string subject,
        EmailTemplate template,
        T model,
        CancellationToken cancellationToken = default
    )
        where T : IEmailModel
    {
        try
        {
            // Convertimos el valor del Enum en el nombre del archivo (Ej. EmailTemplate.ConfirmEmail => "ConfirmEmail.cshtml")
            string templateName = $"{template}.cshtml";

            // Construimos la ruta física hacia la carpeta de plantillas
            string templatePath = Path.Combine(
                AppContext.BaseDirectory,
                "Templates",
                "Emails",
                templateName
            );

            // Verificamos que el archivo de plantilla exista antes de intentar enviarlo
            if (!File.Exists(templatePath))
            {
                _logger.LogError(
                    "No se encontró el archivo de plantilla Razor en la ruta: {Path}",
                    templatePath
                );
                return false;
            }

            // Configuramos y enviamos el correo usando el motor de Razor
            var email = _emailFactory
                .Create()
                .To(toEmail)
                .Subject(subject)
                .UsingTemplateFromFile(templatePath, model);

            var response = await email.SendAsync(cancellationToken);

            if (!response.Successful)
            {
                _logger.LogError(
                    "Error enviando correo a {Email}. Detalles: {Errors}",
                    toEmail,
                    string.Join(", ", response.ErrorMessages)
                );
                return false;
            }

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Excepción crítica al intentar enviar correo a {Email}", toEmail);
            return false;
        }
    }
}
