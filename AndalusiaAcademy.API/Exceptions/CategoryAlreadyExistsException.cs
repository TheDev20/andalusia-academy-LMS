namespace AndalusiaAcademy.API.Exceptions;

public class CategoryAlreadyExistsException : ConflictException
{
    public CategoryAlreadyExistsException(string message) : base(message) { }
}
