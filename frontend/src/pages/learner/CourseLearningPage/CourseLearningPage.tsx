import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { learningApi } from "../../../services/api/learningApi";
import { ErrorAlert, LoadingState, PortalPage, ProgressBar, Tabs } from "../../../components/portal/Portal";
import { formatDate } from "../../../utils/format";
import ScheduleTab from "./ScheduleTab";
import MaterialsTab from "./MaterialsTab";
import AssignmentsTab from "./AssignmentsTab";
import { courseQueryKey } from "./queryKeys";

type TabId = "schedule" | "materials" | "assignments";

export default function CourseLearningPage() {
  const { courseOfferingId = "" } = useParams<{ courseOfferingId: string }>();
  const [tab, setTab] = useState<TabId>("schedule");

  const { data: course, isLoading, error } = useQuery({
    queryKey: courseQueryKey(courseOfferingId),
    queryFn: ({ signal }) => learningApi.getCourse(courseOfferingId, signal),
    enabled: !!courseOfferingId,
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <PortalPage title="Loading course…" backTo="/dashboard" backLabel="My dashboard">
        <LoadingState />
      </PortalPage>
    );
  }

  if (error || !course) {
    return (
      <PortalPage title="Course unavailable" backTo="/dashboard" backLabel="My dashboard">
        <ErrorAlert error={error ?? new Error("Course not found.")} />
      </PortalPage>
    );
  }

  const { progress } = course;

  return (
    <PortalPage
      title={course.courseTitle}
      subtitle={`${formatDate(course.startsAt)} – ${formatDate(course.endsAt)}${
        course.instructors.length ? ` · Instructor${course.instructors.length > 1 ? "s" : ""}: ${course.instructors.join(", ")}` : ""
      }`}
      backTo="/dashboard"
      backLabel="My dashboard"
    >
      <section className="portal-card" aria-label="Progress">
        <div className="portal-row-between" style={{ marginBottom: 14 }}>
          <h2 className="portal-card-title">Your progress</h2>
          <strong style={{ fontSize: 22, color: "#271e16" }}>{progress.overallPercent}%</strong>
        </div>
        <div className="portal-form-grid">
          <ProgressBar
            percent={progress.resourceCompletionPercent}
            label={`Materials ${progress.completedResources}/${progress.requiredResources}`}
          />
          <ProgressBar
            percent={progress.attendancePercent}
            label={`Attendance ${progress.sessionsAttended}/${progress.sessionsHeld}`}
          />
          <ProgressBar
            percent={progress.assignmentCompletionPercent}
            label={`Assignments ${progress.assignmentsSubmitted}/${progress.assignments}`}
          />
        </div>
      </section>

      {course.courseDescription && <p className="portal-subtitle" style={{ margin: "20px 0" }}>{course.courseDescription}</p>}

      <Tabs<TabId>
        label="Course sections"
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "schedule", label: `Schedule & attendance (${course.sessions.length})` },
          { id: "materials", label: `Materials (${course.resources.length})` },
          { id: "assignments", label: `Assignments (${course.assignments.length})` },
        ]}
      />

      {tab === "schedule" && <ScheduleTab sessions={course.sessions} timeZoneId={course.timeZoneId} />}
      {tab === "materials" && <MaterialsTab courseOfferingId={courseOfferingId} resources={course.resources} />}
      {tab === "assignments" && <AssignmentsTab courseOfferingId={courseOfferingId} assignments={course.assignments} />}
    </PortalPage>
  );
}
