using Guestly.Application.DTOs.Reservations;
using Guestly.Application.Interfaces.External;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Application.Models.Emails;
using Guestly.Domain.Entities.Notifications;
using Guestly.Domain.Enums;
using Guestly.Domain.Exceptions;
using Mapster;
using MediatR;

namespace Guestly.Application.Commands.Reservations.UpdateReservationStatus;

/// <summary>
/// Manejador del comando UpdateReservationStatusCommand. Este manejador se encarga de procesar la lógica de negocio
/// para actualizar el estado de una reserva, incluyendo la validación de que el usuario que realiza la acción
/// tenga los permisos necesarios (ya sea el huésped o el anfitrión), y la actualización del estado de la reserva en la base de datos.
/// </summary>
public class UpdateReservationStatusCommandHandler
    : IRequestHandler<UpdateReservationStatusCommand, ReservationResponse>
{
    private readonly IReservationRepository _reservationRepository;
    private readonly IPropertyRepository _propertyRepository;
    private readonly IUserRepository _userRepository;
    private readonly INotificationRepository _notificationRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmailService _emailService;

    public UpdateReservationStatusCommandHandler(
        IReservationRepository reservationRepository,
        IPropertyRepository propertyRepository,
        IUserRepository userRepository,
        INotificationRepository notificationRepository,
        IUnitOfWork unitOfWork,
        IEmailService emailService
    )
    {
        _reservationRepository = reservationRepository;
        _propertyRepository = propertyRepository;
        _userRepository = userRepository;
        _notificationRepository = notificationRepository;
        _unitOfWork = unitOfWork;
        _emailService = emailService;
    }

    /// <summary>
    /// Maneja la lógica para actualizar el estado de una reserva. Esto incluye verificar que la reserva exista,
    /// que el usuario que realiza la acción sea el huésped o el anfitrión de la reserva, y que el nuevo estado
    /// sea válido para la operación. Si todas las validaciones pasan, se actualiza el estado de la reserva y
    /// se guarda en la base de datos, y se devuelve la información actualizada de la reserva en la respuesta.
    /// </summary>
    public async Task<ReservationResponse> Handle(
        UpdateReservationStatusCommand request,
        CancellationToken cancellationToken
    )
    {
        var reservation = await _reservationRepository.GetByIdAsync(
            request.ReservationId,
            cancellationToken
        );
        if (reservation is null)
        {
            throw AppException.NotFound("Reserva no encontrada.", ErrorCodes.ReservationNotFound);
        }

        var property = await _propertyRepository.GetByIdAsync(
            reservation.PropertyId,
            cancellationToken
        );
        if (property is null)
        {
            throw AppException.NotFound(
                "La propiedad asociada a esta reserva no existe.",
                ErrorCodes.PropertyNotFound
            );
        }

        bool isHost = property != null && property.HostId == request.UserId;
        bool isGuest = reservation.GuestId == request.UserId;

        if (!isHost && !isGuest)
        {
            throw AppException.Forbidden(
                "No tienes permiso para modificar esta reserva.",
                ErrorCodes.ReservationAccessDenied
            );
        }

        var guest = await _userRepository.GetByIdAsync(reservation.GuestId, cancellationToken);
        var host = await _userRepository.GetByIdAsync(property!.HostId, cancellationToken);

        if (guest is null || host is null)
        {
            throw AppException.NotFound(
                "El huésped o el anfitrión asociado a esta reserva no existe.",
                ErrorCodes.UserNotFound
            );
        }

        await _unitOfWork.BeginTransactionAsync(cancellationToken);

        try
        {
            if (request.NewStatus == ReservationStatus.Confirmed)
            {
                if (!isHost)
                {
                    throw AppException.Forbidden(
                        "Solo el anfitrión de la propiedad puede confirmar la reserva.",
                        ErrorCodes.ReservationAccessDenied
                    );
                }
                reservation.Confirm();
            }
            else if (request.NewStatus == ReservationStatus.Cancelled)
            {
                reservation.Cancel();
            }
            else
            {
                throw AppException.BadRequest(
                    "Estado de reserva no válido para esta operación.",
                    ErrorCodes.InvalidReservationStatus
                );
            }

            _reservationRepository.Update(reservation);

            // Creamos una notificación para el usuario afectado por el cambio de estado
            Notification? appNotification = null;

            // Si la reserva es confirmada, notificamos al huésped.
            if (request.NewStatus == ReservationStatus.Confirmed)
            {
                appNotification = new Notification(
                    userId: guest.Id,
                    title: "Reserva Confirmada",
                    message: $"¡Buenas noticias! Tu reserva en '{property.Title}' ha sido confirmada por el anfitrión.",
                    type: NotificationTypes.ReservationConfirmed
                );
            }
            // Si el host cancela, notificamos al guest. Si el guest cancela, notificamos al host.
            else if (request.NewStatus == ReservationStatus.Cancelled)
            {
                var targetUserId = isHost ? guest.Id : host.Id;
                var cancellerName = isHost ? "El anfitrión" : "El huésped";

                appNotification = new Notification(
                    userId: targetUserId,
                    title: "Reserva Cancelada",
                    message: $"{cancellerName} ha cancelado la reserva para '{property.Title}'.",
                    type: NotificationTypes.ReservationCancelled
                );
            }

            // Solo agregamos la notificación si se ha creado una (es decir, si el estado es confirmado o cancelado)
            if (appNotification != null)
            {
                await _notificationRepository.AddAsync(appNotification, cancellationToken);
            }

            // UnitOfWork es inteligente y llamara a SaveChangesAsync()
            // siempre, de esa siempre se persisten los cambios.
            await _unitOfWork.CommitAsync(cancellationToken);

            if (request.NewStatus == ReservationStatus.Confirmed)
            {
                var confirmedModel = new ReservationConfirmedModel(
                    GuestName: guest.FirstName,
                    PropertyTitle: property.Title,
                    PropertyLocation: property.Location,
                    CheckInDate: reservation.CheckInDate,
                    CheckOutDate: reservation.CheckOutDate,
                    ReservationId: reservation.Id.ToString(),
                    TotalPrice: reservation.TotalPrice,
                    HostName: host.FirstName,
                    PropertyImageUrl: property.Images.FirstOrDefault() ?? "placeholder-img" // TODO: Cambiar por una imagen por defecto adecuada para propiedades sin imágenes
                );

                await _emailService.SendTemplateEmailAsync(
                    guest.Email,
                    "¡Tu reserva ha sido confirmada! - Guestly",
                    EmailTemplate.ReservationConfirmed,
                    confirmedModel,
                    cancellationToken
                );
            }
            else if (request.NewStatus == ReservationStatus.Cancelled)
            {
                var targetUser = isHost ? guest : host;

                var cancelledModel = new ReservationCancelledModel(
                    UserName: targetUser.FirstName,
                    PropertyTitle: property.Title,
                    CheckInDate: reservation.CheckInDate,
                    CheckOutDate: reservation.CheckOutDate,
                    ReservationId: reservation.Id.ToString()
                );

                await _emailService.SendTemplateEmailAsync(
                    targetUser.Email,
                    "Actualización: Tu reserva ha sido cancelada",
                    EmailTemplate.ReservationCancelled,
                    cancelledModel,
                    cancellationToken
                );
            }

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
            await _unitOfWork.RollbackAsync(cancellationToken);
            throw;
        }
    }
}
