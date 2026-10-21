using AndalusiaAcademy.API.DTOs.Learning;

namespace AndalusiaAcademy.API.Services.Implementations.Learning;

/// <summary>
/// Raw counters for one learner in one course offering.
/// </summary>
public readonly record struct ProgressInputs(
    int RequiredResources,
    int CompletedRequiredResources,
    int SessionsHeld,
    int SessionsAttended,
    int Assignments,
    int AssignmentsSubmitted);

/// <summary>
/// Basic progress model: the overall percentage is the mean of the components that apply
/// (a course with no assignments is not penalised for them).
/// </summary>
public static class ProgressCalculator
{
    public static ProgressDto Calculate(ProgressInputs input)
    {
        var resources = Percent(input.CompletedRequiredResources, input.RequiredResources);
        var attendance = Percent(input.SessionsAttended, input.SessionsHeld);
        var assignments = Percent(input.AssignmentsSubmitted, input.Assignments);

        var applicable = new[] { resources, attendance, assignments }.Where(p => p.HasValue).Select(p => p!.Value).ToList();
        var overall = applicable.Count == 0 ? 0m : Math.Round(applicable.Average(), 1);

        return new ProgressDto(
            input.RequiredResources,
            input.CompletedRequiredResources,
            input.SessionsHeld,
            input.SessionsAttended,
            input.Assignments,
            input.AssignmentsSubmitted,
            resources ?? 0m,
            attendance ?? 0m,
            assignments ?? 0m,
            overall);
    }

    private static decimal? Percent(int numerator, int denominator)
    {
        if (denominator <= 0)
        {
            return null;
        }

        var clamped = Math.Clamp(numerator, 0, denominator);
        return Math.Round(clamped * 100m / denominator, 1);
    }
}
