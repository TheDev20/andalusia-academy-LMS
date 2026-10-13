namespace AndalusiaAcademy.API.Services.Interfaces.Identity;


public interface IPasswordHasherService
{
    string HashPassword(string password);
    bool VerifyPassword(string password, string passwordHash);
}