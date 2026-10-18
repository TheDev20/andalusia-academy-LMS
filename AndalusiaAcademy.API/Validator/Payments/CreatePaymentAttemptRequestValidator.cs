using FluentValidation;
using AndalusiaAcademy.API.DTOs.Payments;

namespace AndalusiaAcademy.API.Validator.Payments;

public class CreatePaymentAttemptRequestValidator : AbstractValidator<CreatePaymentAttemptRequest>
{
    public CreatePaymentAttemptRequestValidator()
    {
        RuleFor(x => x.SalesOrderId)
            .NotEmpty().WithMessage("SalesOrderId is required.");

        RuleFor(x => x.Provider)
            .NotEmpty().WithMessage("Payment provider is required.")
            .MaximumLength(60);

        RuleFor(x => x.IdempotencyKey)
            .NotEmpty().WithMessage("IdempotencyKey is required.")
            .MaximumLength(100);
    }
}
