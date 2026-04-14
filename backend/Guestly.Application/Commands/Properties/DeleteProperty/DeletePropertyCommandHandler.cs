using Guestly.Application.Interfaces.External;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Exceptions;
using MediatR;

namespace Guestly.Application.Commands.Properties.DeleteProperty;

/// <summary>
/// Manejador para el comando de eliminación de una propiedad. Este manejador se encarga de validar la existencia de la propiedad,
/// verificar que el host que intenta eliminar la propiedad sea el mismo que la creó, validar que
/// la propiedad no tenga reservas activas que impidan su eliminación, eliminar las imágenes asociadas a la propiedad
/// utilizando el servicio de gestión de imágenes, y finalmente eliminar la propiedad del repositorio.
/// </summary>
public class DeletePropertyCommandHandler : IRequestHandler<DeletePropertyCommand, bool>
{
    private readonly IPropertyRepository _propertyRepository;
    private readonly IImageUploadService _imageUploadService;

    public DeletePropertyCommandHandler(
        IPropertyRepository propertyRepository,
        IImageUploadService imageUploadService
    )
    {
        _propertyRepository = propertyRepository;
        _imageUploadService = imageUploadService;
    }

    /// <summary>
    /// Maneja la lógica para eliminar una propiedad existente, incluyendo la validación de permisos, validación de reservas activas,
    /// eliminación de imágenes asociadas y eliminación de la propiedad del repositorio.
    /// </summary>
    public async Task<bool> Handle(
        DeletePropertyCommand request,
        CancellationToken cancellationToken
    )
    {
        var property = await _propertyRepository.GetByIdAsync(
            request.PropertyId,
            cancellationToken
        );
        if (property is null)
        {
            throw AppException.NotFound("Propiedad no encontrada.", ErrorCodes.PropertyNotFound);
        }

        if (property.HostId != request.HostId)
        {
            throw AppException.Forbidden(
                "No tienes permisos para eliminar esta propiedad.",
                ErrorCodes.PropertyAccessDenied
            );
        }

        try
        {
            // Validar si la propiedad puede ser eliminada (verificar reservas activas)
            property.ValidateForDeletion();
        }
        catch (DomainException ex)
        {
            throw AppException.BadRequest(ex.Message, ex.Code);
        }

        // Eliminar imágenes asociadas a la propiedad
        if (property.Images.Any())
        {
            foreach (var imageUrl in property.Images)
            {
                await _imageUploadService.DeleteImageAsync(imageUrl, cancellationToken);
            }
        }

        // Eliminar la propiedad
        _propertyRepository.Delete(property);

        return true;
    }
}
