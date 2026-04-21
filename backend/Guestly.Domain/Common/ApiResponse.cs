namespace Guestly.Domain.Common;

/// <summary>
/// Clase genérica para representar la respuesta de la API,
/// con un formato consistente que incluye un indicador de éxito (Ok),
/// los datos de la respuesta (Data) y la información del error en
/// caso de que ocurra un error (Error), lo que facilita el manejo de respuestas
/// tanto exitosas como de error en el cliente,
/// proporcionando una estructura clara y uniforme para todas las respuestas de la API.
/// </summary>
/// <typeparam name="T">Tipo de datos de la respuesta</typeparam>
public class ApiResponse<T>
{
    /// <summary>
    /// Indica si la respuesta fue exitosa o no.
    /// </summary>
    /// <example>true</example>
    public bool Ok { get; private set; }

    /// <summary>
    /// Contiene los datos de la respuesta
    /// </summary>
    public T? Data { get; private set; }

    /// <summary>
    /// Contiene la información del error ocurrido
    /// </summary>
    /// <example>null</example>
    public ApiError? Error { get; private set; }

    /// <remarks>
    /// Constructor para respuestas exitosas,
    /// recibe los datos de la respuesta y establece Ok en true,
    /// Data con los datos proporcionados y Error en null.
    /// </remarks>
    /// <param name="data">datos de la respuesta</param>
    public ApiResponse(T data)
    {
        Ok = true;
        Data = data;
        Error = null;
    }

    /// <remarks>
    /// Constructor para respuestas de error,
    /// recibe un objeto ApiError y establece Ok en false,
    /// Data en null y Error con el objeto proporcionado.
    /// </remarks>
    /// <param name="error">información del error</param>
    public ApiResponse(ApiError error)
    {
        Ok = false;
        Data = default;
        Error = error;
    }

    /// <remarks>
    /// Constructor para respuestas de error,
    /// recibe un código de error y un mensaje,
    /// establece Ok en false, Data en null y Error con un nuevo objeto ApiError construido
    /// </remarks>
    /// <param name="code">código de error</param>
    /// <param name="message">mensaje de error</param>
    public ApiResponse(string code, string message)
    {
        Ok = false;
        Data = default;
        Error = new ApiError(code, message);
    }

    /// <remarks>
    /// Método estático de conveniencia para crear una respuesta exitosa,
    /// recibe los datos y devuelve un nuevo ApiResponse con esos datos.
    /// </remarks>
    /// <param name="data">datos de la respuesta</param>
    /// <returns>respuesta exitosa</returns>
    public static ApiResponse<T> Success(T data) => new ApiResponse<T>(data);

    /// <remarks>
    /// Método estático de conveniencia para crear una respuesta de error,
    /// recibe un objeto ApiError y devuelve un nuevo ApiResponse con ese error.
    /// </remarks>
    /// <param name="error">Un objeto de tipo ApiError ya construido con sus datos</param>
    /// <returns>respuesta de error</returns>
    public static ApiResponse<T> Failure(ApiError error) => new ApiResponse<T>(error);

    /// <remarks>
    /// Método estático de conveniencia para crear una respuesta de error,
    /// recibe un código de error y un mensaje, y devuelve un nuevo ApiResponse con esa
    /// información de error, construyendo internamente un nuevo objeto
    /// ApiError con el código y mensaje proporcionados.
    /// </remarks>
    /// <param name="code">código de error</param>
    /// <param name="message">mensaje de error</param>
    /// <returns>respuesta de error</returns>
    public static ApiResponse<T> Failure(string code, string message) =>
        new ApiResponse<T>(code, message);
}
