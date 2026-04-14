using Microsoft.AspNetCore.Http;

namespace Guestly.Application.DTOs.Properties;

/// <summary>
/// Representa la solicitud para actualizar una propiedad existente en el sistema.
/// Contiene información como el título, descripción, ubicación, precio por noche, tarifa de limpieza, capacidad
/// y las imágenes asociadas a la propiedad. Además, permite especificar qué imágenes se desean eliminar de la propiedad
/// </summary>
public record UpdatePropertyRequest()
{
    /// <summary>
    /// El título de la propiedad. Es un campo obligatorio que describe brevemente la propiedad.
    /// </summary>
    public required string Title { get; init; }

    /// <summary>
    /// La descripción de la propiedad. Es un campo obligatorio que proporciona detalles adicionales sobre la propiedad,
    /// como sus características, comodidades y cualquier otra información relevante para los huéspedes potenciales.
    /// </summary>
    public required string Description { get; init; }

    /// <summary>
    /// La ubicación de la propiedad. Es un campo obligatorio que indica dónde se encuentra la propiedad,
    /// lo cual es crucial para los huéspedes al momento de elegir un lugar para hospedarse.
    /// </summary>
    public required string Location { get; init; }

    /// <summary>
    /// La tarifa por noche de la propiedad. Es un campo obligatorio
    /// que especifica el costo de hospedarse en la propiedad por noche.
    /// </summary>
    public required decimal PricePerNight { get; init; }

    /// <summary>
    /// La tarifa de limpieza de la propiedad. Es un campo opcional que puede ser un monto fijo o un porcentaje del subtotal,
    /// dependiendo de la política de la propiedad.
    /// </summary>
    public required decimal CleaningFee { get; init; }

    /// <summary>
    /// La capacidad de la propiedad. Es un campo obligatorio
    /// que indica cuántas personas pueden hospedarse en la propiedad al mismo tiempo.
    /// </summary>
    public required int Capacity { get; init; }

    /// <summary>
    /// Las imágenes asociadas a la propiedad. Es un campo opcional que permite al usuario subir nuevas imágenes para la propiedad.
    /// </summary>
    public List<IFormFile>? Images { get; init; }

    /// <summary>
    /// Las imágenes que se desean eliminar de la propiedad.
    /// Es un campo opcional que permite al usuario especificar qué imágenes existentes de la propiedad desea eliminar.
    /// </summary>
    public List<string>? ImagesToDelete { get; init; }
}
