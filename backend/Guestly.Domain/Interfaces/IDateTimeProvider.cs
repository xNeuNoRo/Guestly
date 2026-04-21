namespace Guestly.Domain.Interfaces;

/// <summary>
/// Interfaz que define un proveedor de fecha y hora,
/// con una propiedad UtcNow que devuelve la fecha y hora actual en formato UTC,
/// utilizada para abstraer la obtención de la fecha y hora actual en la aplicación,
/// permitiendo una mayor flexibilidad y facilidad de pruebas al poder simular diferentes fechas y horas
/// en lugar de depender directamente de DateTime.UtcNow en el código de la aplicación.
/// </summary>
public interface IDateTimeProvider
{
    /// <summary>
    /// Propiedad que devuelve la fecha y hora actual en formato UTC,
    /// utilizada para obtener la fecha y hora actual de manera abstracta en la aplicación.
    /// </summary>
    /// <example>2026-06-01T12:00:00Z</example>
    DateTime UtcNow { get; }
}
