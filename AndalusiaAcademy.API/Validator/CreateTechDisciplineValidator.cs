using FluentValidation;
using AndalusiaAcademy.API.DTOs.Catalog;

namespace AndalusiaAcademy.API.Validator;

public class CreateTechDisciplineValidator : AbstractValidator<CreateTechDisciplineRequest>
{
    public CreateTechDisciplineValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(150).WithMessage("Title cannot exceed 150 characters.")
            .Must(title => !title.Contains('<') && !title.Contains('>')).WithMessage("Title must not contain HTML tags.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");

        RuleFor(x => x.Icon)
            .NotEmpty().WithMessage("Icon name is required.");
    }
}

public class UpdateTechDisciplineValidator : AbstractValidator<UpdateTechDisciplineRequest>
{
    public UpdateTechDisciplineValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(150).WithMessage("Title cannot exceed 150 characters.")
            .Must(title => !title.Contains('<') && !title.Contains('>')).WithMessage("Title must not contain HTML tags.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");

        RuleFor(x => x.Icon)
            .NotEmpty().WithMessage("Icon name is required.");
    }
}
