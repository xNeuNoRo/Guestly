using Microsoft.AspNetCore.Http;

namespace Guestly.Application.DTOs.Properties;

/// <summary>
/// Representa la solicitud para crear una nueva propiedad en el sistema.
/// Contiene información como el título, descripción, ubicación, precio por noche, capacidad y las imágenes asociadas a la propiedad.
/// </summary>
public record CreatePropertyRequest()
{
    public required string Title { get; init; }
    public required string Description { get; init; }
    public required string Location { get; init; }
    public required decimal PricePerNight { get; init; }
    public required int Capacity { get; init; }
    public required List<IFormFile> Images { get; init; }
}
