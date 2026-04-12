using Guestly.Application.DTOs.Reservations;
using MediatR;

namespace Guestly.Application.Commands.Reservations.CreatePropertyBlock;

/// <summary>
/// Comando para crear un bloque de propiedad. Este comando se utiliza para bloquear una propiedad
/// durante un período específico, impidiendo que los huéspedes realicen reservas en esas fechas.
/// </summary>
public record CreatePropertyBlockCommand(
    Guid HostId,
    Guid PropertyId,
    DateTime StartDate,
    DateTime EndDate,
    string? Reason
) : IRequest<PropertyBlockResponse>;
