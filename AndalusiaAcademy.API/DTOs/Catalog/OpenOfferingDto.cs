namespace AndalusiaAcademy.API.DTOs.Catalog;

/// <summary>
/// An intake that is currently open for applications, shown on course details next to the Apply action.
/// </summary>
public record OpenOfferingDto(
    Guid Id,
    DateTimeOffset StartsAt,
    DateTimeOffset EndsAt,
    string TimeZoneId,
    decimal Price,
    string Currency,
    int SeatsRemaining
);
