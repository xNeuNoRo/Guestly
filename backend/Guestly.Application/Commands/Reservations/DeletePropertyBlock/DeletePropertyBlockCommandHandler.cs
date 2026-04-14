using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Exceptions;
using MediatR;

namespace Guestly.Application.Commands.Reservations.DeletePropertyBlock;

/// <summary>
/// Manejador del comando para eliminar un bloque de fechas de una propiedad,
/// que se encarga de validar la existencia del bloque a eliminar,
/// verificar que el anfitrión tenga permisos para eliminarlo, eliminar el bloque de fechas
/// utilizando el repositorio de bloques de fechas, y devolver un booleano indicando si la eliminación fue exitosa o no.
/// </summary>
public class DeletePropertyBlockCommandHandler : IRequestHandler<DeletePropertyBlockCommand, bool>
{
    private readonly IPropertyBlockRepository _propertyBlockRepository;
    private readonly IPropertyRepository _propertyRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeletePropertyBlockCommandHandler(
        IPropertyBlockRepository propertyBlockRepository,
        IPropertyRepository propertyRepository,
        IUnitOfWork unitOfWork
    )
    {
        _propertyBlockRepository = propertyBlockRepository;
        _propertyRepository = propertyRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Manejador del comando para eliminar un bloque de fechas de una propiedad
    /// que se encarga de validar la existencia del bloque a eliminar,
    /// verificar que el anfitrión tenga permisos para eliminarlo, eliminar el bloque de fechas
    /// utilizando el repositorio de bloques de fechas, y devolver un booleano indicando si la eliminación fue exitosa o no.
    /// </summary>
    public async Task<bool> Handle(
        DeletePropertyBlockCommand request,
        CancellationToken cancellationToken
    )
    {
        var block = await _propertyBlockRepository.GetByIdAsync(request.BlockId, cancellationToken);
        if (block is null)
        {
            throw AppException.NotFound(
                "El bloqueo de fechas no existe.",
                ErrorCodes.PropertyBlockNotFound
            );
        }

        var property = await _propertyRepository.GetByIdAsync(block.PropertyId, cancellationToken);
        if (property is null || property.HostId != request.HostId)
        {
            throw AppException.Forbidden(
                "No tienes permisos para eliminar este bloqueo de fechas.",
                ErrorCodes.PropertyAccessDenied
            );
        }

        _propertyBlockRepository.Delete(block);

        // UnitOfWork es inteligente y llamara a SaveChangesAsync()
        // solamente si es que no detecta una transaccion activa
        await _unitOfWork.CommitAsync(cancellationToken);

        return true;
    }
}
