using System.Reflection;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace Guestly.Application;

public static class DependencyInjection
{
    /// <summary>
    /// Extensión de IServiceCollection para registrar los servicios de la capa de aplicación.
    /// Aquí registramos automáticamente los handlers de MediatR y los validadores de FluentValidation
    /// </summary>
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Obtenemos la referencia al ensamblado actual para registrar automáticamente
        // los handlers de MediatR y los validadores de FluentValidation
        var assembly = Assembly.GetExecutingAssembly();

        services.AddMediatR(cfg =>
        {
            // Registramos todos los handlers de MediatR del ensamblado actual
            cfg.RegisterServicesFromAssembly(assembly);
            // Registramos el pipeline de validación para que se ejecute antes de los handlers
            cfg.AddOpenBehavior(typeof(Behaviors.ValidationBehavior<,>));
        });

        // Registramos todos los validadores de FluentValidation del ensamblado actual
        services.AddValidatorsFromAssembly(assembly);

        // Devolvemos el IServiceCollection para permitir encadenar otras llamadas de configuración
        return services;
    }
}
