using AndalusiaAcademy.API.Services.Implementations.Learning;

namespace AndalusiaAcademy.Tests.UnitTests.BusinessRules;

public class ProgressCalculatorTests
{
    [Fact]
    public void Overall_is_the_mean_of_applicable_components()
    {
        var progress = ProgressCalculator.Calculate(new ProgressInputs(
            RequiredResources: 4, CompletedRequiredResources: 2,
            SessionsHeld: 2, SessionsAttended: 2,
            Assignments: 1, AssignmentsSubmitted: 0));

        Assert.Equal(50m, progress.ResourceCompletionPercent);
        Assert.Equal(100m, progress.AttendancePercent);
        Assert.Equal(0m, progress.AssignmentCompletionPercent);
        Assert.Equal(50m, progress.OverallPercent);
    }

    [Fact]
    public void Components_without_items_do_not_penalise_the_learner()
    {
        var progress = ProgressCalculator.Calculate(new ProgressInputs(2, 2, 0, 0, 0, 0));

        Assert.Equal(100m, progress.OverallPercent);
        Assert.Equal(0m, progress.AttendancePercent);
    }

    [Fact]
    public void Nothing_to_measure_yields_zero()
    {
        Assert.Equal(0m, ProgressCalculator.Calculate(default).OverallPercent);
    }

    [Fact]
    public void Counts_above_the_denominator_are_clamped()
    {
        var progress = ProgressCalculator.Calculate(new ProgressInputs(1, 3, 1, 5, 1, 2));

        Assert.Equal(100m, progress.ResourceCompletionPercent);
        Assert.Equal(100m, progress.AttendancePercent);
        Assert.Equal(100m, progress.OverallPercent);
    }

    [Fact]
    public void Percentages_are_rounded_to_one_decimal()
    {
        Assert.Equal(33.3m, ProgressCalculator.Calculate(new ProgressInputs(3, 1, 0, 0, 0, 0)).ResourceCompletionPercent);
    }
}
