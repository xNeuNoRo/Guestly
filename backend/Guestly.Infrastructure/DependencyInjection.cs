using System.Net;
using System.Net.Mail;
using Guestly.Application.Interfaces.External;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Application.Interfaces.Security;
using Guestly.Domain.Interfaces;
using Guestly.Infrastructure.External;
using Guestly.Infrastructure.Persistence;
using Guestly.Infrastructure.Persistence.Repositories;
using Guestly.Infrastructure.Providers;
using Guestly.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Guestly.Infrastructure;

/// <summary>
/// Clase estática para registrar todos los servicios, repositorios y configuraciones
/// de la capa de Infraestructura en el contenedor de Inyección de Dependencias.
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        // Configuramos la Base de Datos (Entity Framework Core)
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
        );

        // Registramos el Unit of Work y Repositorios como Scoped, ya que suelen mantener estado por petición (DbContext)
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IUserTokenRepository, UserTokenRepository>();
        services.AddScoped<IPropertyRepository, PropertyRepository>();
        services.AddScoped<IPropertyBlockRepository, PropertyBlockRepository>();
        services.AddScoped<IReservationRepository, ReservationRepository>();
        services.AddScoped<IReviewRepository, ReviewRepository>();
        services.AddScoped<INotificationRepository, NotificationRepository>();

        // Usamos Singleton para clases que no mantienen estado (Stateless)
        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
        services.AddSingleton<IPasswordHasher, PasswordHasher>();
        services.AddSingleton<IRandomTokenGenerator, RandomTokenGenerator>();

        // El JwtTokenGenerator a veces necesita leer datos por petición, Scoped es más seguro
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

        // Servicios Externos
        services.AddScoped<IImageUploadService, CloudinaryImageUploadService>();

        // Configuración de FluentEmail para los correos electrónicos transaccionales
        ConfigureFluentEmail(services, configuration);
        services.AddScoped<IEmailService, FluentEmailService>();

        return services;
    }

    /// <summary>
    /// Configura el motor de renderizado de Razor y el envío SMTP para FluentEmail.
    /// </summary>
    private static void ConfigureFluentEmail(
        IServiceCollection services,
        IConfiguration configuration
    )
    {
        // TODO: Configurar debidamente esto para prod si llego a desplegar xd
        var senderEmail = configuration["EmailSettings:SenderEmail"] ?? "noreply@guestly.com";
        var senderName = configuration["EmailSettings:SenderName"] ?? "Guestly";

        var smtpHost = configuration["EmailSettings:SmtpHost"] ?? "localhost";
        var smtpPort = int.TryParse(configuration["EmailSettings:SmtpPort"], out int port)
            ? port
            : 587;
        var smtpUser = configuration["EmailSettings:SmtpUser"] ?? "";
        var smtpPass = configuration["EmailSettings:SmtpPass"] ?? "";

        services
            .AddFluentEmail(senderEmail, senderName)
            .AddRazorRenderer()
            .AddSmtpSender(
                new SmtpClient(smtpHost, smtpPort)
                {
                    Credentials = new NetworkCredential(smtpUser, smtpPass),
                    EnableSsl = true,
                }
            );
    }
}
