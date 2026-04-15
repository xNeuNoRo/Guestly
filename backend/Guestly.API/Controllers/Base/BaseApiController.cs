using Microsoft.AspNetCore.Mvc;
using Guestly.Domain.Common;
using Guestly.Domain.Exceptions;

namespace Guestly.API.Controllers.Base;

/// <summary>
/// Controlador base para la API, proporciona métodos de conveniencia para
/// devolver respuestas con el formato de ApiResponse, y también define la
/// ruta base para todos los controladores que hereden de esta clase, que será
/// "api/v1/nombre-del-controlador", donde "nombre-del-controlador" es el nombre
/// de la clase del controlador sin el sufijo "Controller".
/// </summary>
[ApiController] // Esto es para que el framework sepa que esta clase es un controlador de API, y no un controlador de MVC
[Route("api/v1/[controller]")] // Esto es para que la ruta de cada controlador sea "api/v1/nombre-del-controlador", donde "nombre-del-controlador" es el nombre de la clase del controlador sin el sufijo "Controller"
public abstract class BaseApiController : ControllerBase
{
    /// <remarks>
    /// Método de conveniencia para devolver una respuesta exitosa con el formato de ApiResponse,
    /// recibe los datos de la respuesta y devuelve un IActionResult con un ApiResponse exitoso que contiene esos datos.
    /// </remarks>
    /// <typeparam name="T">El tipo de datos de la respuesta</typeparam>
    /// <param name="data">Los datos de la respuesta</param>
    /// <returns>Un IActionResult con un ApiResponse exitoso</returns>
    protected IActionResult Success<T>(T data)
    {
        return Ok(ApiResponse<T>.Success(data));
    }

    /// <remarks>
    /// Método de conveniencia para devolver una respuesta exitosa sin datos, con el formato de ApiResponse,
    /// devuelve un IActionResult con un ApiResponse exitoso que no contiene datos (Data es null).
    /// </remarks>
    /// <returns>Un IActionResult con un ApiResponse exitoso</returns>
    protected IActionResult Success()
    {
        return Ok(ApiResponse<object>.Success(null!));
    }

    /// <remarks>
    /// Método de conveniencia para devolver una respuesta exitosa con el formato de ApiResponse,
    /// recibe el nombre de la acción para obtener el recurso creado, los valores de la ruta
    /// y los datos del recurso creado, y devuelve un IActionResult con un ApiResponse exitoso que contiene esos datos,
    /// además de incluir en la respuesta la ruta para obtener el recurso creado en el header "Location" de la respuesta.
    /// </remarks>
    /// <typeparam name="T">El tipo de datos del recurso creado</typeparam>
    /// <param name="actionName">El nombre de la acción para obtener el recurso creado</param>
    /// <param name="routeValues">Los valores de la ruta para construir la URL del recurso creado</param>
    /// <param name="data">Los datos del recurso creado</param>
    /// <returns>Un IActionResult con un ApiResponse exitoso</returns>
    protected IActionResult CreatedSuccess<T>(string actionName, object routeValues, T data)
    {
        // --------------------------------
        // * CreatedAtAction(...) es para devolver un 201 Created,
        // y ademas incluir en la respuesta la ruta para obtener el recurso creado
        // En el apartado de "Location" del header de la respuesta.

        //  * actionName es el nombre del metodo para obtener el recurso creado, por ejemplo "GetById",
        // lo recomendado es usarlo con nameof() por si este metodo cambia de nombre

        // * routeValues es el objeto anonomo con las propiedades necesarias para construir la ruta, por ejemplo new { id = result.Id }
        // Si el metodo es GetById y require dicho id, entonces se le pasa new { id = result.Id }, donde result.Id es el id del recurso creado, que se va a incluir en la ruta de la respuesta

        // * result es el recurso creado, que se va a incluir en la respuesta
        return CreatedAtAction(actionName, routeValues, ApiResponse<T>.Success(data));
    }

    /// <remarks>
    /// Método de conveniencia para devolver una respuesta exitosa
    /// o un error 404 Not Found con el formato de ApiResponse,
    /// recibe los datos de la respuesta y, si son nulos, devuelve
    /// un IActionResult con un ApiResponse de error 404 Not Found,
    /// y si no son nulos, devuelve un IActionResult con un ApiResponse
    /// exitoso que contiene esos datos.
    /// </remarks>
    /// <typeparam name="T">El tipo de datos de la respuesta</typeparam>
    /// <param name="data">Los datos de la respuesta</param>
    /// <param name="errorCode">El código de error</param>
    /// <param name="errorMessage">El mensaje de error</param>
    /// <returns>Un IActionResult con la respuesta correspondiente</returns>
    protected IActionResult SuccessOrNotFound<T>(
        T? data,
        string errorCode = ErrorCodes.NotFound,
        string errorMessage = "El recurso solicitado no fue encontrado."
    )
        where T : class // Esto es para indicar que T debe ser un tipo de referencia,
    // ya que solo los tipos de referencia pueden ser nulos (null)
    // y así poder usar la lógica de devolver NotFound si data es null
    {
        if (data == null)
        {
            var apiError = new ApiError(errorCode, errorMessage);
            return NotFound(ApiResponse<object>.Failure(apiError));
        }

        return Success(data);
    }

    /// <summary>
    /// Método de conveniencia para devolver una respuesta exitosa o un error 404 Not Found con el formato de ApiResponse,
    /// recibe un booleano que indica si la condición se cumple o no, y si no
    /// se cumple, devuelve un IActionResult con un ApiResponse de error 404 Not Found
    /// con el código de error y mensaje proporcionados, y si se cumple,
    /// devuelve un IActionResult con un ApiResponse exitoso.
    /// </summary>
    /// <param name="condition">La condición a evaluar</param>
    /// <param name="errorCode">El código de error</param>
    /// <param name="message">El mensaje de error</param>
    /// <returns>Un IActionResult con la respuesta correspondiente</returns>
    protected IActionResult SuccessOrNotFound(
        bool condition,
        string errorCode = ErrorCodes.NotFound,
        string message = "El recurso solicitado no fue encontrado."
    )
    {
        if (condition)
        {
            return Success();
        }

        return NotFound(ApiResponse<object>.Failure(errorCode, message));
    }

    /// <remarks>
    /// Método de conveniencia para devolver una respuesta exitosa
    /// o un error de validación con el formato de ApiResponse,
    /// recibe un booleano que indica si la operación fue exitosa o no, y si no fue exitosa,
    /// devuelve un IActionResult con un ApiResponse de error 400 Bad Request
    /// con el código de error y mensaje proporcionados, y si fue exitosa, devuelve un
    /// IActionResult con un ApiResponse exitoso que contiene un objeto con una propiedad "success" en true.
    /// </remarks>
    /// <param name="result">Resultado de la operación</param>
    /// <param name="errorCode">Código de error</param>
    /// <param name="message">Mensaje de error</param>
    /// <returns>Un IActionResult con la respuesta correspondiente</returns>
    protected IActionResult SuccessOrFailure(
        bool result,
        string errorCode = ErrorCodes.InternalServerError,
        string message = "La operación no pudo completarse."
    )
    {
        if (!result)
            return FailureResponse(errorCode, message, 400);
        return Success();
    }

    /// <remarks>
    /// Método de conveniencia para devolver una respuesta de error con el formato de ApiResponse,
    /// recibe un código de error, un mensaje y un código de estado HTTP (por defecto 400 Bad Request),
    /// y devuelve un IActionResult con un ApiResponse de error
    /// que contiene el código de error y el mensaje proporcionados.
    /// </remarks>
    /// <param name="errorCode">Código de error</param>
    /// <param name="message">Mensaje de error</param>
    /// <param name="statusCode">Código de estado HTTP</param>
    /// <returns>Un IActionResult con la respuesta correspondiente</returns>
    protected IActionResult FailureResponse(string errorCode, string message, int statusCode = 400)
    {
        var response = ApiResponse<object>.Failure(errorCode, message);
        return StatusCode(statusCode, response);
    }

    /// <remarks>
    /// Método de conveniencia para devolver una respuesta de error por conflicto con el formato de ApiResponse,
    /// recibe un mensaje y un código de error (por defecto "ResourceConflict"),
    /// y devuelve un IActionResult con un ApiResponse de error
    /// que contiene el código de error y el mensaje proporcionados, con un código de estado HTTP 409 Conflict.
    /// </remarks>
    /// <param name="message">Mensaje de error</param>
    /// <param name="errorCode">Código de error</param>
    /// <returns>Un IActionResult con la respuesta correspondiente</returns>
    protected IActionResult ConflictResponse(
        string message,
        string errorCode = ErrorCodes.ResourceConflict
    ) => FailureResponse(errorCode, message, 409);
}
