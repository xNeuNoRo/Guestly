using FluentEmail.Core;
using Guestly.Application.Interfaces.External;
using Guestly.Application.Models.Emails;
using Guestly.Domain.Enums;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Guestly.Infrastructure.External;

/// <summary>
/// Implementación del servicio de correos electrónicos utilizando FluentEmail y Razor Templates.
/// </summary>
public class FluentEmailService : IEmailService
{
    // Utilizamos IServiceScopeFactory para crear un ámbito de servicio y resolver IFluentEmailFactory dentro de ese ámbito,
    // lo que nos permite enviar correos electrónicos de manera segura y eficiente sin depender
    // directamente de la inyección de dependencias en el constructor.
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<FluentEmailService> _logger;

    public FluentEmailService(IServiceScopeFactory scopeFactory, ILogger<FluentEmailService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    public Task<bool> SendTemplateEmailAsync<T>(
        string toEmail,
        string subject,
        EmailTemplate template,
        T model,
        CancellationToken cancellationToken = default
    )
        where T : IEmailModel
    {
        _ = Task.Run(async () =>
        {
            try
            {
                // Creamos un nuevo ámbito de servicio para resolver IFluentEmailFactory,
                // lo que nos permite enviar correos electrónicos de manera segura y eficiente.
                using var scope = _scopeFactory.CreateScope();
                var emailFactory = scope.ServiceProvider.GetRequiredService<IFluentEmailFactory>();

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
                var email = emailFactory
                    .Create()
                    .To(toEmail)
                    .Subject(subject)
                    .UsingTemplateFromFile(templatePath, model);

                // CancellationToken.None se utiliza aquí para evitar que el token
                // de cancelación afecte el proceso de envío del correo electrónico,
                // ya que FluentEmail no soporta cancelación nativa.
                // Esto asegura que el intento de envío se complete incluso si el token original ha sido cancelado.
                var response = await email.SendAsync(CancellationToken.None);

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
                _logger.LogError(
                    ex,
                    "Excepción crítica al intentar enviar correo a {Email}",
                    toEmail
                );
                return false;
            }
        });

        return Task.FromResult(true);
    }
}
