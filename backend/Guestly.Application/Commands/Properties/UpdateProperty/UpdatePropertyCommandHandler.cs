using Guestly.Application.DTOs.Properties;
using Guestly.Application.Interfaces.External;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Exceptions;
using Mapster;
using MediatR;

namespace Guestly.Application.Commands.Properties.UpdateProperty;

/// <summary>
/// Manejador para el comando de actualización de una propiedad. Este manejador se encarga de validar la existencia de la propiedad,
/// verificar que el host que intenta modificar la propiedad sea el mismo que la creó, actualizar los detalles de la propiedad,
/// eliminar las imágenes que se indicaron para eliminación, agregar nuevas imágenes si se proporcionaron,
/// y finalmente guardar los cambios en la propiedad.
/// </summary>
public class UpdatePropertyCommandHandler : IRequestHandler<UpdatePropertyCommand, PropertyResponse>
{
    private readonly IPropertyRepository _propertyRepository;
    private readonly IUserRepository _userRepository;
    private readonly IImageUploadService _imageUploadService;

    public UpdatePropertyCommandHandler(
        IPropertyRepository propertyRepository,
        IUserRepository userRepository,
        IImageUploadService imageUploadService
    )
    {
        _propertyRepository = propertyRepository;
        _userRepository = userRepository;
        _imageUploadService = imageUploadService;
    }

    /// <summary>
    /// Maneja la lógica para actualizar una propiedad existente, incluyendo la validación de permisos, actualización de detalles,
    /// gestión de imágenes y mapeo de la respuesta con los datos del host y las imágenes actualizadas.
    /// </summary>
    public async Task<PropertyResponse> Handle(
        UpdatePropertyCommand request,
        CancellationToken cancellationToken
    )
    {
        // Validar que la propiedad exista
        var property = await _propertyRepository.GetByIdAsync(
            request.PropertyId,
            cancellationToken
        );
        if (property is null)
        {
            throw AppException.NotFound("Propiedad no encontrada.", ErrorCodes.PropertyNotFound);
        }

        // Verificar que el host que intenta modificar la propiedad sea el mismo que la creó
        if (property.HostId != request.HostId)
        {
            throw AppException.Forbidden(
                "No tienes permisos para modificar esta propiedad.",
                ErrorCodes.PropertyAccessDenied
            );
        }

        // Actualizar los detalles de la propiedad
        property.UpdateDetails(
            request.Title,
            request.Description,
            request.Location,
            request.PricePerNight,
            request.Capacity
        );

        // Eliminar las imágenes que se indicaron para eliminación
        if (request.ImagesToDelete is not null)
        {
            foreach (var imageUrl in request.ImagesToDelete)
            {
                await _imageUploadService.DeleteImageAsync(imageUrl, cancellationToken);
                property.RemoveImage(imageUrl);
            }
        }

        // Agregar nuevas imágenes si se proporcionaron
        if (request.Images is not null && request.Images.Any())
        {
            foreach (var imageFile in request.Images)
            {
                var newImageUrl = await _imageUploadService.UploadImageAsync(
                    imageFile,
                    cancellationToken
                );
                property.AddImage(newImageUrl);
            }
        }

        // Guardar los cambios en la propiedad
        _propertyRepository.Update(property);

        // Obtener los datos del host para incluirlos en la respuesta
        var host = await _userRepository.GetByIdAsync(property.HostId, cancellationToken);
        var response = property.Adapt<PropertyResponse>();

        // Mapear los datos adicionales del host y las imágenes a la respuesta
        return response with
        {
            Host = new HostSummaryResponse
            {
                HostId = host!.Id,
                HostName = $"{host.FirstName} {host.LastName}",
            },
            ImageUrls = property.Images.ToList(),
            AverageRating = property.Reviews.Any() ? property.Reviews.Average(r => r.Rating) : 0.0,
            TotalReviews = property.Reviews.Count,
        };
    }
}
