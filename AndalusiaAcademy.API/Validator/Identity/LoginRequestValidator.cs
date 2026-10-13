using FluentValidation;
using AndalusiaAcademy.API.DTOs.Identity;

namespace AndalusiaAcademy.API.Validator.Identity;

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty();
    }
}