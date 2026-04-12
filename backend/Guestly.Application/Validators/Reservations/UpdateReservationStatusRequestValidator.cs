using FluentValidation;
using Guestly.Application.DTOs.Reservations;

namespace Guestly.Application.Validators.Reservations;

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
