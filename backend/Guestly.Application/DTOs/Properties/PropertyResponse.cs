namespace Guestly.Application.DTOs.Properties;

/// <summary>
/// Representa un resumen de la información del anfitrión de una propiedad. Contiene el ID único del anfitrión y su nombre.
/// </summary>
public record HostSummaryResponse()
{
    /// <summary>
    /// El ID único del anfitrión. Es un campo obligatorio que identifica de manera única a cada anfitrión en el sistema.
    /// </summary>
    public required Guid HostId { get; init; }

    /// <summary>
    /// El nombre del anfitrión. Es un campo obligatorio que proporciona el nombre del usuario que es el anfitrión de la propiedad.
    /// </summary>
    public required string HostName { get; init; }
}

/// <summary>
/// Representa la respuesta que se devuelve al cliente después de realizar operaciones relacionadas con las propiedades,
/// como crear, actualizar o consultar una propiedad. Contiene información detallada sobre la propiedad,
/// incluyendo su ID, título, descripción, ubicación, precio por noche, capacidad, ID del anfitrión
/// y las URLs de las imágenes asociadas a la propiedad.
/// </summary>
public record PropertyResponse()
{
    /// <summary>
    /// El ID único de la propiedad. Es un campo obligatorio que identifica de manera única a cada propiedad en el sistema.
    /// </summary>
    public required Guid Id { get; init; }

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
    /// La capacidad de la propiedad. Es un campo obligatorio
    /// que indica cuántas personas pueden hospedarse en la propiedad al mismo tiempo.
    /// </summary>
    public required int Capacity { get; init; }

    /// <summary>
    /// El anfitrión de la propiedad. Es un campo obligatorio que contiene información resumida sobre el anfitrión de la propiedad,
    /// incluyendo su ID y nombre, lo cual permite a los huéspedes potenciales
    /// conocer quién es el anfitrión antes de tomar una decisión de reserva.
    /// </summary>
    public required HostSummaryResponse Host { get; init; }

    /// <summary>
    /// Las URLs de las imágenes asociadas a la propiedad. Es un campo obligatorio
    /// que contiene una colección de URLs que apuntan a las imágenes de la propiedad,
    /// lo cual permite a los huéspedes potenciales visualizar la propiedad antes de tomar una decisión de reserva.
    /// </summary>
    public required IReadOnlyCollection<string> ImageUrls { get; init; }
}
