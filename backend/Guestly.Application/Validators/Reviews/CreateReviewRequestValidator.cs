using FluentValidation;
using Guestly.Application.DTOs.Reviews;

namespace Guestly.Application.Validators.Reviews;

public class CreateReviewRequestValidator : AbstractValidator<CreateReviewRequest>
{
    public CreateReviewRequestValidator()
    {
        RuleFor(x => x.PropertyId)
            .NotEmpty()
            .WithMessage("Debe especificar la propiedad a la que se refiere la reseña.");

        RuleFor(x => x.ReservationId)
            .NotEmpty()
            .WithMessage("Debe especificar la reserva a la que se refiere la reseña.");

        RuleFor(x => x.Rating)
            .InclusiveBetween(1, 5)
            .WithMessage("La calificación debe ser un valor entre 1 y 5.");

        RuleFor(x => x.Comment)
            .NotEmpty()
            .WithMessage("El comentario es obligatorio.")
            .MaximumLength(1000)
            .WithMessage("El comentario no puede exceder los 1000 caracteres.");
    }
}
