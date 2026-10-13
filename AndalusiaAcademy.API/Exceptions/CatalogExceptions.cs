namespace AndalusiaAcademy.API.Exceptions;

public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message) { }
}

public class ConflictException : Exception
{
    public ConflictException(string message) : base(message) { }
}

public class CategoryAlreadyExistsException : ConflictException
{
    public CategoryAlreadyExistsException(string message) : base(message) { }
}
