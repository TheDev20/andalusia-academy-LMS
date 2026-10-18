namespace AndalusiaAcademy.API.DTOs.Learning;

public class EnrolledCourseDto
{
    public Guid LearningEnrollmentId { get; set; }
    public Guid EnrollmentId { get; set; }
    public Guid CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTimeOffset StartsAt { get; set; }
    public DateTimeOffset EndsAt { get; set; }
    public DateTimeOffset EnrolledAt { get; set; }
}
