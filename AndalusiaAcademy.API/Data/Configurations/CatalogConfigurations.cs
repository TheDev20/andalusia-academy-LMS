using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using AndalusiaAcademy.API.Models.Catalog;
using CatalogProgram = AndalusiaAcademy.API.Models.Catalog.Program;

namespace AndalusiaAcademy.API.Data.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("Category");
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Name).HasMaxLength(200).IsRequired();
        builder.Property(c => c.Slug).HasMaxLength(160).IsRequired();
        builder.HasIndex(c => c.Slug).IsUnique();

        builder.Property(c => c.Description).HasMaxLength(500).HasDefaultValue("");
        builder.Property(c => c.Icon).HasMaxLength(50).HasDefaultValue("Code2");
    }
}

public class CourseConfiguration : IEntityTypeConfiguration<Course>
{
    public void Configure(EntityTypeBuilder<Course> builder)
    {
        builder.ToTable("Course");
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Title).HasMaxLength(250).IsRequired();
        builder.Property(c => c.Slug).HasMaxLength(160).IsRequired();
        builder.HasIndex(c => c.Slug).IsUnique();
        builder.Property(c => c.PublicationStatus).HasMaxLength(24).IsRequired();
        builder.Property(c => c.RowVersion).IsRowVersion();

        // Covering composite index for catalog filtering and title sorting
        builder.HasIndex(c => new { c.PublicationStatus, c.Title });
    }
}

public class ProgramConfiguration : IEntityTypeConfiguration<CatalogProgram>
{
    public void Configure(EntityTypeBuilder<CatalogProgram> builder)
    {
        builder.ToTable("Program");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Title).HasMaxLength(250).IsRequired();
        builder.Property(p => p.Slug).HasMaxLength(160).IsRequired();
        builder.HasIndex(p => p.Slug).IsUnique();
        builder.Property(p => p.PublicationStatus).HasMaxLength(24).IsRequired();
        builder.Property(p => p.RowVersion).IsRowVersion();

        // Covering composite index for catalog filtering and title sorting
        builder.HasIndex(p => new { p.PublicationStatus, p.Title });
    }
}

public class CourseCategoryConfiguration : IEntityTypeConfiguration<CourseCategory>
{
    public void Configure(EntityTypeBuilder<CourseCategory> builder)
    {
        builder.ToTable("CourseCategory");
        builder.HasKey(cc => new { cc.CourseId, cc.CategoryId });

        builder.HasIndex(cc => new { cc.CourseId, cc.Sequence }).IsUnique();
        builder.HasIndex(cc => cc.CategoryId);

        builder.HasOne(cc => cc.Course)
            .WithMany(c => c.CourseCategories)
            .HasForeignKey(cc => cc.CourseId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(cc => cc.Category)
            .WithMany(c => c.CourseCategories)
            .HasForeignKey(cc => cc.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class ProgramCategoryConfiguration : IEntityTypeConfiguration<ProgramCategory>
{
    public void Configure(EntityTypeBuilder<ProgramCategory> builder)
    {
        builder.ToTable("ProgramCategory");
        builder.HasKey(pc => new { pc.ProgramId, pc.CategoryId });

        builder.HasIndex(pc => new { pc.ProgramId, pc.Sequence }).IsUnique();
        builder.HasIndex(pc => pc.CategoryId);

        builder.HasOne(pc => pc.Program)
            .WithMany(p => p.ProgramCategories)
            .HasForeignKey(pc => pc.ProgramId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(pc => pc.Category)
            .WithMany(c => c.ProgramCategories)
            .HasForeignKey(pc => pc.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class ProgramCourseConfiguration : IEntityTypeConfiguration<ProgramCourse>
{
    public void Configure(EntityTypeBuilder<ProgramCourse> builder)
    {
        builder.ToTable("ProgramCourse");
        builder.HasKey(pc => new { pc.ProgramId, pc.CourseId });

        builder.HasIndex(pc => new { pc.ProgramId, pc.Sequence }).IsUnique();

        builder.HasOne(pc => pc.Program)
            .WithMany(p => p.ProgramCourses)
            .HasForeignKey(pc => pc.ProgramId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(pc => pc.Course)
            .WithMany(c => c.ProgramCourses)
            .HasForeignKey(pc => pc.CourseId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class CareerPathConfiguration : IEntityTypeConfiguration<CareerPath>
{
    public void Configure(EntityTypeBuilder<CareerPath> builder)
    {
        builder.ToTable("CareerPath");
        builder.HasKey(cp => cp.Id);

        builder.Property(cp => cp.Title).HasMaxLength(250).IsRequired();
        builder.Property(cp => cp.Slug).HasMaxLength(160).IsRequired();
        builder.HasIndex(cp => cp.Slug).IsUnique();
    }
}

public class CareerPathCourseConfiguration : IEntityTypeConfiguration<CareerPathCourse>
{
    public void Configure(EntityTypeBuilder<CareerPathCourse> builder)
    {
        builder.ToTable("CareerPathCourse");
        builder.HasKey(cpc => new { cpc.CareerPathId, cpc.CourseId });

        builder.HasIndex(cpc => new { cpc.CareerPathId, cpc.Sequence }).IsUnique();

        builder.HasOne(cpc => cpc.CareerPath)
            .WithMany(cp => cp.CareerPathCourses)
            .HasForeignKey(cpc => cpc.CareerPathId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(cpc => cpc.Course)
            .WithMany(c => c.CareerPathCourses)
            .HasForeignKey(cpc => cpc.CourseId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class CareerPathProgramConfiguration : IEntityTypeConfiguration<CareerPathProgram>
{
    public void Configure(EntityTypeBuilder<CareerPathProgram> builder)
    {
        builder.ToTable("CareerPathProgram");
        builder.HasKey(cpp => new { cpp.CareerPathId, cpp.ProgramId });

        builder.HasIndex(cpp => new { cpp.CareerPathId, cpp.Sequence }).IsUnique();

        builder.HasOne(cpp => cpp.CareerPath)
            .WithMany(cp => cp.CareerPathPrograms)
            .HasForeignKey(cpp => cpp.CareerPathId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(cpp => cpp.Program)
            .WithMany(p => p.CareerPathPrograms)
            .HasForeignKey(cpp => cpp.ProgramId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class OfferingConfiguration : IEntityTypeConfiguration<Offering>
{
    public void Configure(EntityTypeBuilder<Offering> builder)
    {
        builder.ToTable("Offering", t =>
        {
            t.HasCheckConstraint(
                "CK_Offering_CourseOrProgram_Exclusive",
                "([CourseId] IS NOT NULL AND [ProgramId] IS NULL) OR ([CourseId] IS NULL AND [ProgramId] IS NOT NULL)");
        });

        builder.HasKey(o => o.Id);
        builder.HasAlternateKey(o => new { o.Id, o.Kind });

        builder.Property(o => o.Kind).HasMaxLength(8).IsRequired();
        builder.Property(o => o.TimeZoneId).HasMaxLength(100).IsRequired();
        builder.Property(o => o.Price).HasPrecision(19, 4);
        builder.Property(o => o.Currency).HasMaxLength(3).IsUnicode(false).IsFixedLength().IsRequired();
        builder.Property(o => o.Status).HasMaxLength(24).IsRequired();
        builder.Property(o => o.RowVersion).IsRowVersion();

        // Covering indexes for catalog active offering queries
        builder.HasIndex(o => new { o.Status, o.StartsAt });
        builder.HasIndex(o => new { o.CourseId, o.Status, o.StartsAt });

        builder.HasOne(o => o.Course)
            .WithMany(c => c.Offerings)
            .HasForeignKey(o => o.CourseId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(o => o.Program)
            .WithMany(p => p.Offerings)
            .HasForeignKey(o => o.ProgramId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class ProgramOfferingCourseConfiguration : IEntityTypeConfiguration<ProgramOfferingCourse>
{
    public void Configure(EntityTypeBuilder<ProgramOfferingCourse> builder)
    {
        builder.ToTable("ProgramOfferingCourse");
        builder.HasKey(poc => new { poc.ProgramOfferingId, poc.CourseOfferingId });

        builder.Property(poc => poc.ProgramKind).HasMaxLength(8).IsRequired();
        builder.Property(poc => poc.CourseKind).HasMaxLength(8).IsRequired();

        builder.HasIndex(poc => new { poc.ProgramOfferingId, poc.Sequence }).IsUnique();

        builder.HasOne(poc => poc.ProgramOffering)
            .WithMany(o => o.ParentProgramOfferingCourses)
            .HasPrincipalKey(o => new { o.Id, o.Kind })
            .HasForeignKey(poc => new { poc.ProgramOfferingId, poc.ProgramKind })
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(poc => poc.CourseOffering)
            .WithMany(o => o.ChildCourseOfferingCourses)
            .HasPrincipalKey(o => new { o.Id, o.Kind })
            .HasForeignKey(poc => new { poc.CourseOfferingId, poc.CourseKind })
            .OnDelete(DeleteBehavior.Restrict);
    }
}
