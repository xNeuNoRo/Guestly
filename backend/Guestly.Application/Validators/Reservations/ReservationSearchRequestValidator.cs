using FluentValidation;
using Guestly.Application.DTOs.Reservations;

namespace Guestly.Application.Validators.Reservations;

public class ReservationSearchRequestValidator : AbstractValidator<ReservationSearchRequest>
{
    public ReservationSearchRequestValidator()
    {
        RuleFor(x => x.Status)
            .IsInEnum()
            .WithMessage("El estado de la reserva no es válido.")
            .When(x => x.Status.HasValue);

        RuleFor(x => x.EndDate)
            .GreaterThanOrEqualTo(x => x.StartDate)
            .When(x => x.StartDate.HasValue && x.EndDate.HasValue)
            .WithMessage(
                "Si especificas un rango de fechas, la fecha de fin debe ser posterior a la de inicio."
            );
    }
}
