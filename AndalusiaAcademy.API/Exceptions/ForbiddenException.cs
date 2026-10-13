namespace AndalusiaAcademy.API.Exceptions;

public class ForbiddenException : Exception
{
    public ForbiddenException(string message) : base(message) { }
}
