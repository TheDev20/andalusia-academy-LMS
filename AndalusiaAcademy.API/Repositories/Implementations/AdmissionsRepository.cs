using Microsoft.EntityFrameworkCore;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.Models.Admissions;
using AndalusiaAcademy.API.Models.Catalog;
using AndalusiaAcademy.API.Models.Payments;
using AndalusiaAcademy.API.Repositories.Interfaces;

namespace AndalusiaAcademy.API.Repositories.Implementations;

public class AdmissionsRepository : IAdmissionsRepository
{
    private readonly ApplicationDbContext _context;

    public AdmissionsRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Offering?> GetOfferingWithDetailsAsync(Guid offeringId, CancellationToken ct = default)
    {
        return await _context.Offerings
            .Include(o => o.Course)
            .Include(o => o.Program)
            .FirstOrDefaultAsync(o => o.Id == offeringId, ct);
    }

    public async Task<bool> HasActiveApplicationAsync(Guid learnerId, Guid offeringId, CancellationToken ct = default)
    {
        return await _context.Applications
            .AnyAsync(a => a.LearnerId == learnerId && a.OfferingId == offeringId && a.Status != "Cancelled", ct);
    }

    public async Task<(Application Application, SalesOrder SalesOrder)> CreateApplicationWithOrderAsync(
        Application application,
        SalesOrder salesOrder,
        CancellationToken ct = default)
    {
        await _context.Applications.AddAsync(application, ct);
        await _context.SalesOrders.AddAsync(salesOrder, ct);
        await _context.SaveChangesAsync(ct);
        return (application, salesOrder);
    }

    public async Task<List<Application>> GetLearnerApplicationsAsync(Guid learnerId, CancellationToken ct = default)
    {
        return await _context.Applications
            .AsNoTracking()
            .Include(a => a.Offering)
                .ThenInclude(o => o.Course)
            .Include(a => a.Offering)
                .ThenInclude(o => o.Program)
            .Where(a => a.LearnerId == learnerId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<List<SalesOrder>> GetSalesOrdersByApplicationIdsAsync(IEnumerable<Guid> applicationIds, CancellationToken ct = default)
    {
        var ids = applicationIds.ToList();
        return await _context.SalesOrders
            .AsNoTracking()
            .Where(so => ids.Contains(so.ApplicationId))
            .ToListAsync(ct);
    }

    public async Task<SalesOrder?> GetSalesOrderWithApplicationAsync(Guid salesOrderId, CancellationToken ct = default)
    {
        return await _context.SalesOrders
            .Include(so => so.Application)
                .ThenInclude(a => a.Offering)
                    .ThenInclude(o => o.Course)
            .Include(so => so.Application)
                .ThenInclude(a => a.Offering)
                    .ThenInclude(o => o.Program)
            .FirstOrDefaultAsync(so => so.Id == salesOrderId, ct);
    }

    public async Task<PaymentAttempt?> GetPaymentByIdempotencyKeyAsync(string idempotencyKey, CancellationToken ct = default)
    {
        return await _context.PaymentAttempts
            .Include(pa => pa.SalesOrder)
                .ThenInclude(so => so.Application)
                    .ThenInclude(a => a.Offering)
                        .ThenInclude(o => o.Course)
            .Include(pa => pa.SalesOrder)
                .ThenInclude(so => so.Application)
                    .ThenInclude(a => a.Offering)
                        .ThenInclude(o => o.Program)
            .FirstOrDefaultAsync(pa => pa.IdempotencyKey == idempotencyKey, ct);
    }

    public async Task<List<PaymentAttempt>> GetLearnerPaymentsAsync(Guid learnerId, CancellationToken ct = default)
    {
        return await _context.PaymentAttempts
            .AsNoTracking()
            .Include(pa => pa.SalesOrder)
                .ThenInclude(so => so.Application)
                    .ThenInclude(a => a.Offering)
                        .ThenInclude(o => o.Course)
            .Include(pa => pa.SalesOrder)
                .ThenInclude(so => so.Application)
                    .ThenInclude(a => a.Offering)
                        .ThenInclude(o => o.Program)
            .Where(pa => pa.SalesOrder.Application.LearnerId == learnerId)
            .OrderByDescending(pa => pa.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<List<LearningEnrollment>> GetLearnerEnrollmentsAsync(Guid learnerId, CancellationToken ct = default)
    {
        return await _context.LearningEnrollments
            .AsNoTracking()
            .Include(le => le.Enrollment)
            .Include(le => le.CourseOffering)
                .ThenInclude(co => co.Course!)
                    .ThenInclude(c => c.CourseCategories)
                        .ThenInclude(cc => cc.Category)
            .Where(le => le.LearnerId == learnerId)
            .OrderByDescending(le => le.Enrollment.EnrolledAt)
            .ToListAsync(ct);
    }

    public async Task<List<Offering>> GetCourseOfferingsForProgramAsync(Guid programId, CancellationToken ct = default)
    {
        var courseIds = await _context.ProgramCourses
            .Where(pc => pc.ProgramId == programId)
            .Select(pc => pc.CourseId)
            .ToListAsync(ct);

        return await _context.Offerings
            .Where(o => o.Kind == "Course" && o.CourseId != null && courseIds.Contains(o.CourseId.Value))
            .ToListAsync(ct);
    }

    public async Task<bool> HasActiveLearningEnrollmentAsync(Guid learnerId, Guid courseOfferingId, CancellationToken ct = default)
    {
        return await _context.LearningEnrollments
            .AnyAsync(le => le.LearnerId == learnerId && le.CourseOfferingId == courseOfferingId && le.Status == "Active", ct);
    }

    public async Task SavePaymentAndEnrollmentAsync(
        PaymentAttempt attempt,
        SalesOrder order,
        Application application,
        Enrollment enrollment,
        List<LearningEnrollment> learningEnrollments,
        CancellationToken ct = default)
    {
        await _context.PaymentAttempts.AddAsync(attempt, ct);
        await _context.Enrollments.AddAsync(enrollment, ct);
        if (learningEnrollments.Count > 0)
        {
            await _context.LearningEnrollments.AddRangeAsync(learningEnrollments, ct);
        }
        await _context.SaveChangesAsync(ct);
    }
}
