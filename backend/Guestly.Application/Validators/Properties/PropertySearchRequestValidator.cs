using FluentValidation;
using Guestly.Application.DTOs.Properties;

namespace Guestly.Application.Validators.Properties;

public class PropertySearchRequestValidator : AbstractValidator<PropertySearchRequest>
{
    public PropertySearchRequestValidator()
    {
        RuleFor(x => x.MinPrice)
            .GreaterThanOrEqualTo(0)
            .WithMessage("El precio mínimo no puede ser negativo.")
            .LessThanOrEqualTo(x => x.MaxPrice)
            .When(x => x.MinPrice.HasValue && x.MaxPrice.HasValue)
            .WithMessage("El precio mínimo no puede ser mayor que el precio máximo.");

        RuleFor(x => x.Capacity)
            .GreaterThan(0)
            .WithMessage("La capacidad debe ser al menos de 1 persona.")
            .When(x => x.Capacity.HasValue);

        RuleFor(x => x.StartDate)
            .GreaterThanOrEqualTo(DateTime.UtcNow.Date)
            .WithMessage("La fecha de inicio no puede ser en el pasado.")
            .When(x => x.StartDate.HasValue);

        RuleFor(x => x.EndDate)
            .GreaterThan(x => x.StartDate)
            .When(x => x.StartDate.HasValue && x.EndDate.HasValue)
            .WithMessage("La fecha de fin debe ser posterior a la de inicio");
    }
}
