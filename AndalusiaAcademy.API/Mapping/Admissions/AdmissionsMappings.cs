using System.Linq.Expressions;
using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.DTOs.Admissions;
using AndalusiaAcademy.API.ENUMs;
using AndalusiaAcademy.API.Models.Admissions;

namespace AndalusiaAcademy.API.Mapping.Admissions;

/// <summary>
/// Server-side projections for the Admissions module.
/// </summary>
public static class AdmissionsMappings
{
    public static Expression<Func<Application, ApplicationDto>> ToApplicationDto(ApplicationDbContext context)
    {
        return a => new ApplicationDto(
            a.Id,
            a.OfferingId,
            a.Offering.Kind,
            a.Offering.Course != null ? a.Offering.Course.Title : a.Offering.Program!.Title,
            a.Offering.StartsAt,
            a.Offering.EndsAt,
            a.Offering.Price,
            a.Offering.Currency,
            a.Status,
            a.SubmittedAt,
            context.SeatReservations
                .Where(r => r.ApplicationId == a.Id && r.Status == ReservationStatuses.Held)
                .Select(r => (DateTimeOffset?)r.ExpiresAt)
                .FirstOrDefault(),
            context.SalesOrders.Where(o => o.ApplicationId == a.Id).Select(o => (Guid?)o.Id).FirstOrDefault(),
            context.SalesOrders.Where(o => o.ApplicationId == a.Id).Select(o => o.Status).FirstOrDefault(),
            a.Enrollment != null ? a.Enrollment.Id : null);
    }

    public static Expression<Func<Enrollment, EnrollmentDto>> ToEnrollmentDto()
    {
        return e => new EnrollmentDto(
            e.Id,
            e.ApplicationId,
            e.Application.OfferingId,
            e.Application.Offering.Kind,
            e.Application.Offering.Course != null ? e.Application.Offering.Course.Title : e.Application.Offering.Program!.Title,
            e.Application.Offering.StartsAt,
            e.Application.Offering.EndsAt,
            e.Status,
            e.EnrolledAt,
            e.LearningEnrollments
                .OrderBy(le => le.CourseOffering.StartsAt)
                .Select(le => new LearningEnrollmentSummaryDto(
                    le.Id,
                    le.CourseOfferingId,
                    le.CourseOffering.Course!.Title,
                    le.Status))
                .ToList());
    }
}
