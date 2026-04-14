namespace Guestly.Application.Models.Emails;

/// <summary>
/// Datos necesarios para la plantilla de bienvenida a nuevos anfitriones (WelcomeHost).
/// </summary>
public record WelcomeHostModel(string FirstName, string DashboardLink) : IEmailModel;
