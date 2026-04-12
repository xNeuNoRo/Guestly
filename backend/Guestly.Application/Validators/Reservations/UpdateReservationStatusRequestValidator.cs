using FluentValidation;
using Guestly.Application.DTOs.Reservations;

namespace Guestly.Application.Validators.Reservations;

/// <summary>
/// Valida las propiedades del UpdateReservationStatusRequest para asegurar que el nuevo estado de la reserva
/// sea uno de los valores válidos definidos en el enum ReservationStatus (Pending, Confirmed, Cancelled).
/// </summary>
public class UpdateReservationStatusRequestValidator
    : AbstractValidator<UpdateReservationStatusRequest>
{
    public UpdateReservationStatusRequestValidator()
    {
        RuleFor(x => x.NewStatus)
            .IsInEnum()
            .WithMessage(
                "El nuevo estado de la reserva no es válido. Debe ser 'Pending', 'Confirmed' o 'Cancelled'."
            );
    }
}
