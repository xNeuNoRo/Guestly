using Guestly.Application.DTOs.Reviews;
using Guestly.Application.Interfaces.Repositories;
using Guestly.Domain.Entities.Notifications;
using Guestly.Domain.Entities.Reviews;
using Guestly.Domain.Enums;
using Guestly.Domain.Exceptions;
using Mapster;
using MediatR;

namespace Guestly.Application.Commands.Reviews.CreateReview;

/// <summary>
/// Manejador para el comando CreateReviewCommand, encargado de procesar la lógica de negocio
/// para crear una nueva reseña de propiedad, incluyendo validaciones como verificar la existencia
/// de la reserva, asegurarse de que el huésped que realiza la reseña es el mismo que hizo la reserva,
/// validar que la reserva corresponde a la propiedad especificada, y que la estancia ha sido completada
/// antes de permitir dejar una reseña, además de manejar casos donde ya existe una reseña para esa reserva,
/// y finalmente crear y almacenar la nueva reseña en el repositorio correspondiente, devolviendo una respuesta
///  con los detalles de la reseña creada.
/// </summary>
public class CreateReviewCommandHandler : IRequestHandler<CreateReviewCommand, ReviewResponse>
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IReservationRepository _reservationRepository;
    private readonly IPropertyRepository _propertyRepository;
    private readonly IUserRepository _userRepository;
    private readonly INotificationRepository _notificationRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateReviewCommandHandler(
        IReviewRepository reviewRepository,
        IReservationRepository reservationRepository,
        IPropertyRepository propertyRepository,
        IUserRepository userRepository,
        INotificationRepository notificationRepository,
        IUnitOfWork unitOfWork
    )
    {
        _reviewRepository = reviewRepository;
        _reservationRepository = reservationRepository;
        _propertyRepository = propertyRepository;
        _userRepository = userRepository;
        _notificationRepository = notificationRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Maneja la lógica para crear una nueva reseña de propiedad, realizando las validaciones necesarias
    /// y asegurando que solo el huésped que realizó la reserva pueda dejar una reseña
    /// después de haber completado su estancia, y que no exista una reseña previa para esa reserva,
    /// además de verificar que la reserva corresponda a la propiedad especificada, y finalmente creando
    /// la reseña y devolviendo una respuesta con los detalles de la reseña creada.
    /// </summary>
    public async Task<ReviewResponse> Handle(
        CreateReviewCommand request,
        CancellationToken cancellationToken
    )
    {
        var reservation = await _reservationRepository.GetByIdAsync(
            request.ReservationId,
            cancellationToken
        );
        if (reservation is null)
        {
            throw AppException.NotFound(
                "La reserva especificada no existe.",
                ErrorCodes.ReservationNotFound
            );
        }

        if (reservation.GuestId != request.GuestId)
        {
            throw AppException.Forbidden(
                "Solo el huésped que realizó la reserva puede dejar una reseña.",
                ErrorCodes.ReservationAccessDenied
            );
        }

        if (reservation.PropertyId != request.PropertyId)
        {
            throw AppException.BadRequest(
                "La reserva no corresponde a la propiedad especificada.",
                ErrorCodes.BadRequest
            );
        }

        if (reservation.Status != ReservationStatus.Completed)
        {
            throw AppException.BadRequest(
                "Solo puedes dejar una reseña después de haber completado tu estancia.",
                ErrorCodes.InvalidReservationStatus
            );
        }

        var alreadyReviewed = await _reviewRepository.ExistsByReservationIdAsync(
            request.ReservationId,
            cancellationToken
        );
        if (alreadyReviewed)
        {
            throw AppException.Conflict(
                "Ya has dejado una reseña para esta reserva.",
                ErrorCodes.ReviewAlreadyExists
            );
        }

        var property = await _propertyRepository.GetByIdAsync(
            request.PropertyId,
            cancellationToken
        );
        var guest = await _userRepository.GetByIdAsync(request.GuestId, cancellationToken);
        if (property is null || guest is null)
        {
            throw AppException.NotFound(
                "No se pudo encontrar la propiedad o el huésped asociado a esta reseña.",
                ErrorCodes.NotFound
            );
        }

        await _unitOfWork.BeginTransactionAsync(cancellationToken);

        try
        {
            // Crear la reseña y guardarla en el repositorio
            var review = new Review(
                propertyId: request.PropertyId,
                reservationId: request.ReservationId,
                guestId: request.GuestId,
                rating: request.Rating,
                comment: request.Comment
            );
            await _reviewRepository.AddAsync(review, cancellationToken);

            // Crear una notificación para el anfitrión informándole que ha recibido una nueva reseña
            var notification = new Notification(
                userId: property.HostId,
                title: "¡Nueva reseña recibida!",
                message: $"{guest.FirstName} ha dejado una calificación de {request.Rating} estrellas para tu propiedad '{property.Title}'.",
                type: NotificationTypes.System
            );
            await _notificationRepository.AddAsync(notification, cancellationToken);

            // UnitOfWork es inteligente y llamara a SaveChangesAsync()
            // siempre, de esa siempre se persisten los cambios.
            await _unitOfWork.CommitAsync(cancellationToken);

            var response = review.Adapt<ReviewResponse>();

            return response with
            {
                PropertyTitle = property!.Title,
                GuestFullName = $"{guest!.FirstName} {guest.LastName}",
            };
        }
        catch (Exception)
        {
            await _unitOfWork.RollbackAsync(cancellationToken);
            throw;
        }
    }
}
