using Microsoft.AspNetCore.Mvc;
using Guestly.Domain.Common;
using Guestly.Domain.Exceptions;

namespace Guestly.API.Extensions;

/// <summary>
/// Extensiones para configurar la respuesta de error personalizada para los casos en que el modelo de datos no sea válido,
/// utilizando el formato de ApiResponse para devolver una respuesta consistente y estructurada
/// lo que facilita el manejo de errores en el cliente y proporciona información detallada
/// sobre los errores de validación que ocurrieron.
/// </summary>
public static class ApiBehaviorOptionsExtensions
{
    /// <remarks>
    /// Configura la respuesta de error personalizada para los casos en que el modelo de datos no sea válido,
    /// utilizando el formato de ApiResponse para devolver una respuesta consistente y estructurada
    /// lo que facilita el manejo de errores en el cliente y proporciona información detallada
    /// sobre los errores de validación que ocurrieron.
    /// </remarks>
    /// <param name="options">Las opciones de comportamiento de la API</param>
    public static void ConfigureInvalidModelStateResponse(this ApiBehaviorOptions options)
    {
        // Sobrescribimos la fábrica de respuestas para modelos no válidos,
        // para devolver una respuesta consistente con nuestro formato de ApiResponse
        options.InvalidModelStateResponseFactory = context =>
        {
            // Extraemos los errores de validación del ModelState,
            // creando un diccionario con el campo y el mensaje de error
            var errors = context
                .ModelState.Where(e => e.Value != null && e.Value.Errors.Count > 0) // Filtramos solo los campos que tienen errores de validación
                .ToDictionary(
                    kvp => kvp.Key, // El nombre del campo (ej. "Title")
                    kvp => kvp.Value!.Errors.Select(err => err.ErrorMessage).ToArray() // Array con todos sus errores
                );

            // Creamos un objeto de respuesta con el formato de ApiResponse,
            // indicando que no fue exitoso y agregando los errores de validación en la sección de error
            var response = ApiResponse<object>.Failure(
                new ApiError(
                    ErrorCodes.ValidationError,
                    "Uno o más campos tienen errores de validación.",
                    errors
                )
            );

            // Devolvemos una respuesta HTTP 400 Bad Request con el objeto de respuesta creado
            return new BadRequestObjectResult(response);
        };
    }
}