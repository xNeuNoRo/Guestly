namespace Guestly.Domain.Exceptions;

/// <summary>
/// Clase de excepción personalizada para la aplicación,
/// que incluye un código de error (Code) y un código de estado HTTP (StatusCode),
/// y proporciona métodos estáticos para crear excepciones comunes
/// como BadRequest, Unauthorized, Forbidden, NotFound, Conflict e InternalServer,
/// lo que facilita la gestión de errores y la comunicación de problemas específicos
/// en la aplicación de manera consistente y estructurada.
/// </summary>
public class AppException : Exception
{
    /// <summary>
    /// Código de estado HTTP asociado con la excepción
    /// </summary>
    /// <example>400</example>
    public int StatusCode { get; }

    /// <summary>
    /// Código de error específico de la aplicación para identificar el tipo de error
    /// </summary>
    /// <example>BAD_REQUEST</example>
    public string Code { get; }

    /// <summary>
    /// Constructor para crear una instancia de AppException
    /// con un código de error, un código de estado HTTP y un mensaje de error,
    /// recibe estos parámetros y los asigna a las propiedades correspondientes,
    /// además de pasar el mensaje al constructor base de Exception para establecer
    /// el mensaje de error de la excepción.
    /// </summary>
    /// <param name="code">Código de error específico de la aplicación</param>
    /// <param name="statusCode">Código de estado HTTP asociado con la excepción</param>
    /// <param name="message">Mensaje de error para la excepción</param>
    public AppException(string code, int statusCode, string message)
        : base(message)
    {
        Code = code;
        StatusCode = statusCode;
    }

    //*******************************************
    // Errores comunes predefinidos
    // *****************************************

    /// <summary>
    /// Método estático para crear una excepción de tipo BadRequest (400)
    /// </summary>
    /// <param name="message">Mensaje de error para la excepción</param>
    /// <param name="code">Código de error específico de la aplicación</param>
    /// <returns>Instancia de AppException</returns>
    public static AppException BadRequest(string message, string code = ErrorCodes.BadRequest) =>
        new(code, 400, message);

    /// <summary>
    /// Método estático para crear una excepción de tipo Unauthorized (401)
    /// </summary>
    /// <param name="message">Mensaje de error para la excepción</param>
    /// <param name="code">Código de error específico de la aplicación</param>
    /// <returns>Instancia de AppException</returns>
    public static AppException Unauthorized(
        string message = "No autorizado",
        string code = ErrorCodes.Unauthorized
    ) => new(code, 401, message);

    /// <summary>
    /// Método estático para crear una excepción de tipo Forbidden (403)
    /// </summary>
    /// <param name="message">Mensaje de error para la excepción</param>
    /// <param name="code">Código de error específico de la aplicación</param>
    /// <returns>Instancia de AppException</returns>
    public static AppException Forbidden(
        string message = "Acceso prohibido",
        string code = ErrorCodes.Forbidden
    ) => new(code, 403, message);

    /// <summary>
    /// Método estático para crear una excepción de tipo NotFound (404)
    /// </summary>
    /// <param name="message">Mensaje de error para la excepción</param>
    /// <param name="code">Código de error específico de la aplicación</param>
    /// <returns>Instancia de AppException</returns>
    public static AppException NotFound(string message, string code = ErrorCodes.NotFound) =>
        new(code, 404, message);

    /// <summary>
    /// Método estático para crear una excepción de tipo Conflict (409)
    /// </summary>
    /// <param name="message">Mensaje de error para la excepción</param>
    /// <param name="code">Código de error específico de la aplicación</param>
    /// <returns>Instancia de AppException</returns>
    public static AppException Conflict(
        string message,
        string code = ErrorCodes.ResourceConflict
    ) => new(code, 409, message);

    /// <summary>
    /// Método estático para crear una excepción de tipo InternalServer (500)
    /// </summary>
    /// <param name="message">Mensaje de error para la excepción</param>
    /// <param name="code">Código de error específico de la aplicación</param>
    /// <returns>Instancia de AppException</returns>
    public static AppException InternalServer(
        string message,
        string code = ErrorCodes.InternalServerError
    ) => new(code, 500, message);

    /// <summary>
    /// Método estático para crear una excepción de tipo ExternalServiceError (502)
    /// </summary>
    /// <param name="message">Mensaje de error para la excepción</param>
    /// <param name="code">Código de error específico de la aplicación</param>
    /// <returns>Instancia de AppException</returns>
    public static AppException ExternalServiceError(
        string message,
        string code = ErrorCodes.ExternalServiceError
    ) => new(code, 502, message);
}
