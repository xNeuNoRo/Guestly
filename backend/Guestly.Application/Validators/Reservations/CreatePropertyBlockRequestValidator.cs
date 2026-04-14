using FluentValidation;
using Guestly.Application.DTOs.Reservations;

namespace Guestly.Application.Validators.Reservations;

public class CreatePropertyBlockRequestValidator : AbstractValidator<CreatePropertyBlockRequest>
{
    public CreatePropertyBlockRequestValidator()
    {
        RuleFor(x => x.PropertyId)
            .NotEmpty()
            .WithMessage("La propiedad a bloquear es obligatoria.");

        RuleFor(x => x.StartDate)
            .NotEmpty()
            .WithMessage("La fecha de inicio es obligatoria.")
            .GreaterThanOrEqualTo(DateTime.UtcNow.Date)
            .WithMessage("No puedes bloquear fechas en el pasado.");

        RuleFor(x => x.EndDate)
            .NotEmpty()
            .WithMessage("La fecha de fin es obligatoria.")
            .GreaterThan(x => x.StartDate)
            .WithMessage("La fecha de fin debe ser posterior a la fecha de inicio.");

        RuleFor(x => x.Reason)
            .MaximumLength(500)
            .WithMessage("La razón del bloqueo no puede exceder los 500 caracteres.");
    }
}
