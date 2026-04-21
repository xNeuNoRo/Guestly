using FluentValidation;
using Guestly.Domain.Exceptions;
using MediatR;

namespace Guestly.Application.Behaviors;

/// <summary>
/// Pipeline de MediatR que intercepta todas las peticiones (Comandos y Queries)
/// antes de que lleguen a su handler correspondiente y ejecuta los validadores de FluentValidation respectivos
/// </summary>
/// <typeparam name="TRequest">El tipo de solicitud a validar.</typeparam>
/// <typeparam name="TResponse">El tipo de respuesta.</typeparam>
public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull // Aseguramos que TRequest no sea un tipo anulable
{
    // Inyectamos todas las validaciones disponibles para el tipo de solicitud TRequest
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    /// <summary>
    /// MediatR llamará a este método para cada solicitud que se envíe a través del mediador.
    /// Aquí es donde ejecutamos la lógica de validación. Si la validación falla,
    /// lanzamos una excepción personalizada con el mensaje del primer error encontrado.
    /// </summary>
    /// <param name="request">La solicitud a validar.</param>
    /// <param name="next">El delegado que representa el siguiente comportamiento en la cadena o el handler final.</param>
    /// <param name="cancellationToken">El token de cancelación.</param>
    /// <returns>La respuesta de la solicitud.</returns>
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next, // Delegado que representa el siguiente comportamiento en la cadena o el handler final
        CancellationToken cancellationToken
    )
    {
        // Si hay validadores registrados para el tipo de solicitud, los ejecutamos
        if (_validators.Any())
        {
            // Creamos un contexto de validación con la solicitud actual
            var context = new ValidationContext<TRequest>(request);

            // Ejecutamos todos los validadores de forma asíncrona y esperamos a que terminen
            var validationResults = await Task.WhenAll(
                _validators.Select(v => v.ValidateAsync(context, cancellationToken))
            );

            // Recolectamos todos los errores de validación que hayan ocurrido
            var failures = validationResults
                .Where(r => r.Errors.Any())
                .SelectMany(r => r.Errors)
                .ToList();

            // Si hay errores de validación
            if (failures.Any())
            {
                // Buscamos el primer error de validación
                var firstError = failures[0].ErrorMessage;
                // Lanzamos una excepción personalizada con el mensaje del primer error
                throw AppException.BadRequest(firstError, ErrorCodes.ValidationError);
            }
        }

        // Si no hay errores de validación, continuamos con el siguiente comportamiento o el handler final
        return await next();
    }
}
