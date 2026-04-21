namespace Guestly.Domain.Exceptions;

/// <summary>
/// Excepción base para violaciones de reglas de negocio dentro de la capa de Dominio.
/// No contiene referencias a códigos HTTP, manteniendo la pureza de la arquitectura.
/// </summary>
public class DomainException : Exception
{
    /// <summary>
    /// Código de error específico de la aplicación, que proporciona información adicional sobre el tipo de error ocurrido,
    /// permitiendo una gestión de errores más estructurada y consistente en la capa de Dominio al identificar claramente
    /// el tipo de error a través de un código predefinido, facilitando así la identificación y manejo de errores específicos
    /// </summary>
    public string Code { get; }

    public DomainException(string message, string code = "DOMAIN_VALIDATION_ERROR")
        : base(message)
    {
        Code = code;
    }
}
