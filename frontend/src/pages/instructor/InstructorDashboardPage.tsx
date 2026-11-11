import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, CalendarDays, ClipboardList, Users } from "lucide-react";
import { instructorApi } from "../../services/api/instructorApi";
import { EmptyState, ErrorAlert, LoadingState, PortalPage, StatusBadge } from "../../components/portal/Portal";
import { formatDate } from "../../utils/format";

export default function InstructorDashboardPage() {
  const { data: cohorts = [], isLoading, error } = useQuery({
    queryKey: ["instructor", "cohorts"],
    queryFn: ({ signal }) => instructorApi.getCohorts(signal),
  });

  return (
    <PortalPage
      title="My cohorts"
      subtitle="Run sessions, record attendance, manage assignments and follow learner progress."
    >
      <ErrorAlert error={error} />
      {isLoading ? (
        <LoadingState label="Loading your cohorts…" />
      ) : cohorts.length === 0 && !error ? (
        <EmptyState title="No cohorts assigned yet">
          <p>An administrator assigns instructors to course offerings. Assigned cohorts will appear here.</p>
        </EmptyState>
      ) : (
        <div className="portal-grid">
          {cohorts.map((cohort) => (
            <article key={cohort.offeringId} className="portal-card">
              <div className="portal-row-between" style={{ marginBottom: 8 }}>
                <StatusBadge status={cohort.status} />
              </div>
              <h2 className="portal-card-title">{cohort.courseTitle}</h2>
              <div className="portal-card-meta" style={{ marginBottom: 14 }}>
                <span>
                  <CalendarDays size={14} aria-hidden="true" /> {formatDate(cohort.startsAt)} – {formatDate(cohort.endsAt)}
                </span>
                <span>
                  <Users size={14} aria-hidden="true" /> {cohort.learnerCount} learners
                </span>
                <span>{cohort.sessionCount} sessions</span>
                <span>
                  <ClipboardList size={14} aria-hidden="true" /> {cohort.assignmentCount} assignments
                </span>
              </div>
              <Link to={`/instructor/cohorts/${cohort.offeringId}`} className="portal-btn">
                Manage cohort <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      )}
    </PortalPage>
  );
}
