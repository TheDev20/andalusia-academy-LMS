namespace AndalusiaAcademy.API.Services.Implementations.Admissions;

/// <summary>Bound from the "Admissions" configuration section.</summary>
public sealed class AdmissionsOptions
{
    public const string SectionName = "Admissions";

    /// <summary>How long a submitted application holds its seat while awaiting payment.</summary>
    public int SeatHoldMinutes { get; init; } = 30;
}
