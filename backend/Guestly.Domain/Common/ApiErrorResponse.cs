namespace Guestly.Domain.Common;

/// <summary>
/// Clase utilizada exclusivamente para documentar en Scalar la estructura
/// exacta de las respuestas cuando ocurre un error (400, 404, etc...).
/// No se usa en la lógica de ejecución real, solo como esquema visual.
/// </summary>
public class ApiErrorResponse
{
    /// <summary>Indica que la petición falló.</summary>
    /// <example>false</example>
    public bool Ok { get; set; } = false;

    /// <summary>No hay datos cuando ocurre un error.</summary>
    /// <example>null</example>
    public object? Data { get; set; }

    /// <summary>Detalles específicos del error ocurrido.</summary>
    public ApiError Error { get; set; } = null!;
}
