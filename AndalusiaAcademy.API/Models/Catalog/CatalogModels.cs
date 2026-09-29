namespace AndalusiaAcademy.API.Models.Catalog;

public class Category
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;

    // Navigation
    public ICollection<CourseCategory> CourseCategories { get; set; } = new List<CourseCategory>();
    public ICollection<ProgramCategory> ProgramCategories { get; set; } = new List<ProgramCategory>();
}

public class Course
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string PublicationStatus { get; set; } = "Draft";
    public byte[] RowVersion { get; set; } = [];

    // Navigation
    public ICollection<CourseCategory> CourseCategories { get; set; } = new List<CourseCategory>();
    public ICollection<ProgramCourse> ProgramCourses { get; set; } = new List<ProgramCourse>();
    public ICollection<CareerPathCourse> CareerPathCourses { get; set; } = new List<CareerPathCourse>();
    public ICollection<Offering> Offerings { get; set; } = new List<Offering>();
}

public class Program
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string PublicationStatus { get; set; } = "Draft";
    public byte[] RowVersion { get; set; } = [];

    // Navigation
    public ICollection<ProgramCategory> ProgramCategories { get; set; } = new List<ProgramCategory>();
    public ICollection<ProgramCourse> ProgramCourses { get; set; } = new List<ProgramCourse>();
    public ICollection<CareerPathProgram> CareerPathPrograms { get; set; } = new List<CareerPathProgram>();
    public ICollection<Offering> Offerings { get; set; } = new List<Offering>();
}

public class CourseCategory
{
    public Guid CourseId { get; set; }
    public Course Course { get; set; } = null!;

    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public int Sequence { get; set; }
}

public class ProgramCategory
{
    public Guid ProgramId { get; set; }
    public Program Program { get; set; } = null!;

    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public int Sequence { get; set; }
}

public class ProgramCourse
{
    public Guid ProgramId { get; set; }
    public Program Program { get; set; } = null!;

    public Guid CourseId { get; set; }
    public Course Course { get; set; } = null!;

    public int Sequence { get; set; }
    public bool IsRequired { get; set; } = true;
}

public class CareerPath
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    // Navigation
    public ICollection<CareerPathCourse> CareerPathCourses { get; set; } = new List<CareerPathCourse>();
    public ICollection<CareerPathProgram> CareerPathPrograms { get; set; } = new List<CareerPathProgram>();
}

public class CareerPathCourse
{
    public Guid CareerPathId { get; set; }
    public CareerPath CareerPath { get; set; } = null!;

    public Guid CourseId { get; set; }
    public Course Course { get; set; } = null!;

    public int Sequence { get; set; }
}

public class CareerPathProgram
{
    public Guid CareerPathId { get; set; }
    public CareerPath CareerPath { get; set; } = null!;

    public Guid ProgramId { get; set; }
    public Program Program { get; set; } = null!;

    public int Sequence { get; set; }
}

public class Offering
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Kind { get; set; } = "Course"; // Course or Program

    public Guid? CourseId { get; set; }
    public Course? Course { get; set; }

    public Guid? ProgramId { get; set; }
    public Program? Program { get; set; }

    public DateTimeOffset StartsAt { get; set; }
    public DateTimeOffset EndsAt { get; set; }
    public string TimeZoneId { get; set; } = "UTC";
    public decimal Price { get; set; }
    public string Currency { get; set; } = "EGP";
    public int Capacity { get; set; }
    public string Status { get; set; } = "Planned";
    public DateTimeOffset? CompositionFrozenAt { get; set; }
    public byte[] RowVersion { get; set; } = [];

    // Navigation
    public ICollection<ProgramOfferingCourse> ParentProgramOfferingCourses { get; set; } = new List<ProgramOfferingCourse>();
    public ICollection<ProgramOfferingCourse> ChildCourseOfferingCourses { get; set; } = new List<ProgramOfferingCourse>();
}

public class ProgramOfferingCourse
{
    public Guid ProgramOfferingId { get; set; }
    public Offering ProgramOffering { get; set; } = null!;

    public Guid CourseOfferingId { get; set; }
    public Offering CourseOffering { get; set; } = null!;

    public string ProgramKind { get; set; } = "Program";
    public string CourseKind { get; set; } = "Course";

    public int Sequence { get; set; }
    public bool IsRequired { get; set; } = true;
}
