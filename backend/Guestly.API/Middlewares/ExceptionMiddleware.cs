using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Guestly.Domain.Common;
using Guestly.Domain.Exceptions;

namespace Guestly.API.Middlewares;

/// <summary>
/// Middleware para manejar excepciones de forma global en la aplicación,
/// capturando cualquier excepción no controlada que ocurra durante el
/// procesamiento de una solicitud HTTP, y devolviendo una respuesta HTTP adecuada
/// con un formato de error consistente utilizando ApiResponse, además de loggear la excepción
/// para facilitar el diagnóstico y la solución de problemas en el servidor.
/// </summary>
public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    /// <summary>
    /// Constructor del middleware de excepciones, recibe las dependencias necesarias
    /// a través de inyección de dependencias, que son el RequestDelegate para poder
    /// llamar al siguiente middleware en la tubería de procesamiento de solicitudes,
    /// y un ILogger para loggear las excepciones que ocurran.
    /// </summary>
    /// <param name="next">El siguiente middleware en la tubería de procesamiento de solicitudes.</param>
    /// <param name="logger">El logger para registrar las excepciones.</param>
    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    /// <summary>
    /// Método principal del middleware, se ejecuta para cada solicitud HTTP entrante,
    /// intenta procesar la solicitud normalmente, pero si ocurre cualquier excepción no controlada,
    /// la captura y maneja la excepción para devolver una respuesta HTTP adecuada al cliente,
    /// utilizando el formato de ApiResponse para mantener la consistencia en las respuestas de error,
    /// además de loggear la excepción para facilitar el diagnóstico y la solución de problemas en el servidor.
    /// </summary>
    /// <param name="context">El contexto de la solicitud HTTP.</param>
    /// <returns>Una tarea asincrónica que representa el procesamiento de la solicitud.</returns>
    public async Task InvokeAsync(HttpContext context)
    {
        // Intentamos procesar la solicitud normalmente
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            // Manejamos la excepción y construimos una respuesta HTTP adecuada para el cliente
            await HandleExceptionAsync(context, ex, _logger);
        }
    }

    /// <summary>
    /// Método para manejar la excepción capturada, determina el tipo de excepción y construye una respuesta HTTP adecuada,
    /// utilizando el formato de ApiResponse para mantener la consistencia en las respuestas de error,
    /// además de loggear la excepción para facilitar el diagnóstico y la solución de problemas en el servidor.
    /// </summary>
    /// <param name="context">El contexto de la solicitud HTTP.</param>
    /// <param name="exception">La excepción capturada.</param>
    /// <param name="logger">El logger para registrar la excepción.</param>
    /// <returns>Una tarea asincrónica que representa el procesamiento de la respuesta.</returns>
    private static Task HandleExceptionAsync(
        HttpContext context,
        Exception exception,
        ILogger logger
    )
    {
        // Verificamos si la respuesta ya ha comenzado a enviarse al cliente,
        // en cuyo caso no podemos modificarla para devolver un error adecuado,
        // por lo que simplemente loggeamos una advertencia y terminamos la tarea sin hacer nada más
        if (context.Response.HasStarted)
        {
            logger.LogWarning(
                "No se puede manejar la excepción porque la respuesta ya ha comenzado a enviarse al cliente."
            );
            return Task.CompletedTask;
        }

        // Configuramos la respuesta HTTP para devolver un JSON
        context.Response.ContentType = "application/json";

        // Por defecto, asumimos un error 500 - Internal Server Error
        var statusCode = (int)HttpStatusCode.InternalServerError;
        var message = "Ha ocurrido un error inesperado en el servidor.";
        string errorCode = ErrorCodes.InternalServerError;

        // Pero, si la excepción es una AppException, podemos extraer el código de error y el mensaje específico
        if (exception is AppException appEx)
        {
            // En este caso, usamos el código de estado, mensaje y código de error definidos en la AppException
            statusCode = appEx.StatusCode;
            message = appEx.Message;
            errorCode = appEx.Code;

            // Loggeamos la excepción de negocio o validación como una advertencia,
            // ya que es un error esperado que puede ocurrir durante el uso normal de la aplicación
            logger.LogWarning(
                "Validación/Lógica de Negocio fallida: {Message} (Code: {Code}, Status: {Status})",
                message,
                errorCode,
                statusCode
            );
        }
        else
        {
            // Si es cualquier otra excepción no controlada, la loggeamos como un error crítico,
            // ya que indica un problema inesperado que no se previo en el servidor
            logger.LogError(
                exception,
                "Ha ocurrido un error crítico no controlado en el servidor."
            );
        }

        // Establecemos el código de estado HTTP en la respuesta
        context.Response.StatusCode = statusCode;

        // Creamos un objeto de respuesta con el formato definido en ApiResponse, indicando que la respuesta no fue exitosa y proporcionando el mensaje de error
        var response = new ApiResponse<object>(errorCode, message);

        // Configuramos la serializacion del JSON para usar camelCase en los nombres de las propiedades
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            Converters = { new JsonStringEnumConverter() },
        };

        // Serializamos el objeto de respuesta a JSON y lo escribimos en la respuesta HTTP
        return context.Response.WriteAsync(JsonSerializer.Serialize(response, options));
    }
}