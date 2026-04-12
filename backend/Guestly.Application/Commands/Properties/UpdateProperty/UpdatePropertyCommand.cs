using Guestly.Application.DTOs.Properties;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Guestly.Application.Commands.Properties.UpdateProperty;

/// <summary>
/// Comando para actualizar una propiedad existente. Permite modificar los detalles de la propiedad,
/// incluyendo su título, descripción, ubicación, precio por noche, capacidad y las imágenes asociadas.
/// También permite eliminar imágenes existentes y agregar nuevas imágenes a la propiedad.
/// </summary>
public record UpdatePropertyCommand(
    Guid PropertyId,
    Guid HostId,
    string Title,
    string Description,
    string Location,
    decimal PricePerNight,
    int Capacity,
    List<IFormFile>? Images,
    List<string>? ImagesToDelete
) : IRequest<PropertyResponse>;
