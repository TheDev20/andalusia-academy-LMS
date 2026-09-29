namespace AndalusiaAcademy.API.Models.Identity;

public class AppUser
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string CountryCode { get; set; } = "EG";
    public string PreferredLanguage { get; set; } = "ar";
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    // Navigation
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public InstructorProfile? InstructorProfile { get; set; }
    public ICollection<TermsAcceptance> TermsAcceptances { get; set; } = new List<TermsAcceptance>();
}

public class Role
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    // Navigation
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}

public class UserRole
{
    public Guid UserId { get; set; }
    public AppUser User { get; set; } = null!;

    public Guid RoleId { get; set; }
    public Role Role { get; set; } = null!;
}

public class Permission
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    // Navigation
    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}

public class RolePermission
{
    public Guid RoleId { get; set; }
    public Role Role { get; set; } = null!;

    public Guid PermissionId { get; set; }
    public Permission Permission { get; set; } = null!;
}

public class InstructorProfile
{
    public Guid UserId { get; set; }
    public AppUser User { get; set; } = null!;

    public string Biography { get; set; } = string.Empty;
}

public class TermsVersion
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Version { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTimeOffset PublishedAt { get; set; } = DateTimeOffset.UtcNow;

    // Navigation
    public ICollection<TermsAcceptance> Acceptances { get; set; } = new List<TermsAcceptance>();
}

public class TermsAcceptance
{
    public Guid UserId { get; set; }
    public AppUser User { get; set; } = null!;

    public Guid TermsVersionId { get; set; }
    public TermsVersion TermsVersion { get; set; } = null!;

    public DateTimeOffset AcceptedAt { get; set; } = DateTimeOffset.UtcNow;
}
