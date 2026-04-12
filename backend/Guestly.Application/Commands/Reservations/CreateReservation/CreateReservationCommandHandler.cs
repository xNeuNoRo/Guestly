using Guestly.Application.DTOs.Reservations;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Entities.Reservations;
using Guestly.Domain.Exceptions;
using Guestly.Domain.Interfaces;
using Mapster;
using MediatR;

namespace Guestly.Application.Commands.Reservations.CreateReservation;

/// <summary>
/// Manejador del comando CreateReservationCommand. Este manejador se encarga de procesar la lógica de negocio
/// para crear una nueva reserva, incluyendo la validación de la disponibilidad de las fechas, la verificación
/// de que el huésped no esté intentando reservar su propia propiedad, y la creación de la reserva en la base de datos.
/// </summary>
public class CreateReservationCommandHandler
    : IRequestHandler<CreateReservationCommand, ReservationResponse>
{
    private readonly IPropertyRepository _propertyRepository;
    private readonly IReservationRepository _reservationRepository;
    private readonly IPropertyBlockRepository _propertyBlockRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IDateTimeProvider _dateTimeProvider;

    public CreateReservationCommandHandler(
        IPropertyRepository propertyRepository,
        IReservationRepository reservationRepository,
        IPropertyBlockRepository propertyBlockRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IDateTimeProvider dateTimeProvider
    )
    {
        _propertyRepository = propertyRepository;
        _reservationRepository = reservationRepository;
        _propertyBlockRepository = propertyBlockRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _dateTimeProvider = dateTimeProvider;
    }

    /// <summary>
    /// Maneja la lógica para crear una nueva reserva. Esto incluye verificar que la propiedad exista,
    /// que el huésped no esté reservando su propia propiedad, y que las fechas seleccionadas estén
    /// disponibles. Si todas las validaciones pasan, se crea la reserva y se guarda en la base de datos.
    /// </summary>
    public async Task<ReservationResponse> Handle(
        CreateReservationCommand request,
        CancellationToken cancellationToken
    )
    {
        await _unitOfWork.BeginTransactionAsync(cancellationToken);

        try
        {
            var property = await _propertyRepository.GetByIdAsync(
                request.PropertyId,
                cancellationToken
            );
            if (property is null)
            {
                throw AppException.NotFound("La propiedad no existe.", ErrorCodes.PropertyNotFound);
            }

            if (property.HostId == request.GuestId)
            {
                throw AppException.Forbidden(
                    "No puedes reservar tu propia propiedad.",
                    ErrorCodes.PropertyAccessDenied
                );
            }

            var hasOverlappingReservations =
                await _reservationRepository.HasOverlappingReservationsAsync(
                    request.PropertyId,
                    request.StartDate,
                    request.EndDate,
                    cancellationToken
                );

            if (hasOverlappingReservations)
            {
                throw AppException.Conflict(
                    "Las fechas seleccionadas ya están reservadas por otro huésped",
                    ErrorCodes.DatesUnavailable
                );
            }

            var hasOverlappingBlocks = await _propertyBlockRepository.HasOverlappingBlocksAsync(
                request.PropertyId,
                request.StartDate,
                request.EndDate,
                null, // No se excluye ningún bloque específico, ya que estamos creando una nueva reserva
                cancellationToken
            );

            if (hasOverlappingBlocks)
            {
                throw AppException.Conflict(
                    "El anfitrión ha bloqueado la disponibilidad en estas fechas",
                    ErrorCodes.DatesUnavailable
                );
            }

            var reservation = new Reservation(
                propertyId: request.PropertyId,
                guestId: request.GuestId,
                checkInDate: request.StartDate,
                checkOutDate: request.EndDate,
                propertyPricePerNight: property.PricePerNight,
                currentTime: _dateTimeProvider.UtcNow
            );

            await _reservationRepository.AddAsync(reservation, cancellationToken);

            var guest = await _userRepository.GetByIdAsync(request.GuestId, cancellationToken);
            var host = await _userRepository.GetByIdAsync(property.HostId, cancellationToken);

            await _unitOfWork.CommitAsync(cancellationToken);

            var response = reservation.Adapt<ReservationResponse>();

            return response with
            {
                PropertyTitle = property.Title,
                PropertyLocation = property.Location,
                PropertyThumbnailUrl = property.Images.FirstOrDefault() ?? string.Empty,
                GuestName = $"{guest!.FirstName} {guest.LastName}",
                HostName = $"{host!.FirstName} {host.LastName}",
            };
        }
        catch (Exception)
        {
            // Si algo falla, revertimos la transaccion para mantener la integridad de los datos
            await _unitOfWork.RollbackAsync(cancellationToken);
            throw;
        }
    }
}
