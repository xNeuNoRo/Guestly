using Microsoft.AspNetCore.Mvc;

namespace Guestly.API.Extensions;

/// <summary>
/// Extensiones para configurar mensajes de error personalizados
/// en las validaciones de model binding de ASP.NET Core.
/// Permite personalizar los mensajes de error que se devuelven cuando
/// ocurre un error durante el proceso de vinculación de modelos,
/// haciendo que los mensajes sean más claros y específicos para los consumidores.
/// </summary>
public static class MvcOptionsExtensions
{
    /// <remarks>
    /// Configura mensajes de error personalizados para las validaciones de model binding en ASP.NET Core.
    /// </remarks>
    /// <param name="options">Las opciones de configuración de MVC.</param>
    public static void ConfigureModelBindingMessages(this MvcOptions options)
    {
        // Obtenemos el proveedor de mensajes de error para el model binding,
        // que es responsable de generar los mensajes de error cuando ocurre
        // un error durante el proceso de vinculación de modelos.
        var provider = options.ModelBindingMessageProvider;

        // Personalizamos los mensajes de error para que sean más claros y específicos, en lugar de los mensajes genéricos que ASP.NET Core proporciona por defecto.

        // Error cuando el valor proporcionado no es valido para el campo especifico
        provider.SetAttemptedValueIsInvalidAccessor(
            (v, f) => $"El valor '{v}' no es válido para el campo '{f}'."
        );
        // Error cuando el valor proporcionado no es valido para un campo que no se pudo identificar
        provider.SetUnknownValueIsInvalidAccessor(
            (f) => $"El valor proporcionado no es válido para el campo '{f}'."
        );

        // Error cuando el valor proporcionado no es valido para un campo que no se pudo identificar
        // y no se conoce el nombre del campo
        provider.SetNonPropertyAttemptedValueIsInvalidAccessor(
            (v) => $"El valor '{v}' no es válido."
        );
        // Error cuando el valor proporcionado es null para un campo que no se pudo identificar
        provider.SetNonPropertyUnknownValueIsInvalidAccessor(() =>
            "El valor proporcionado no es válido."
        );

        // Error cuando el valor proporcionado es null para un campo que no se pudo identificar
        provider.SetValueIsInvalidAccessor((v) => $"El valor '{v}' es inválido.");
        // Cuando envían null y no se permite que sea null
        provider.SetValueMustNotBeNullAccessor((f) => $"El valor '{f}' no puede ser nulo.");
        // Error cuando se espera un cuerpo de petición pero no se proporciona ninguno
        provider.SetMissingRequestBodyRequiredValueAccessor(() =>
            "El cuerpo de la petición no puede estar vacío."
        );
        // Error cuando falta un valor para un campo específico que es requerido
        provider.SetMissingBindRequiredValueAccessor(
            (f) => $"Falta proporcionar un valor para el campo requerido '{f}'."
        );
        // Error cuando se esperaba un valor pero no se proporcionó ninguno
        provider.SetMissingKeyOrValueAccessor(() => "Se requiere proporcionar un valor.");

        // Error cuando se esperaba un número pero se proporcionó un valor que no es un número
        provider.SetNonPropertyValueMustBeANumberAccessor(() =>
            "El valor debe ser un número válido."
        );
        // Error cuando se esperaba un número para un campo específico pero se proporcionó un valor que no es un número
        provider.SetValueMustBeANumberAccessor((f) => $"El campo '{f}' debe ser un número válido.");
    }
}