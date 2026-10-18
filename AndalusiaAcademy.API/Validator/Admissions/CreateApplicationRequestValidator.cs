using FluentValidation;
using AndalusiaAcademy.API.DTOs.Admissions;

namespace AndalusiaAcademy.API.Validator.Admissions;

public class CreateApplicationRequestValidator : AbstractValidator<CreateApplicationRequest>
{
    public CreateApplicationRequestValidator()
    {
        RuleFor(x => x.OfferingId)
            .NotEmpty().WithMessage("OfferingId is required.");
    }
}
