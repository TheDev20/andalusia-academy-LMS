import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { instructorApi } from "../../services/api/instructorApi";
import { ErrorAlert, LoadingState, PortalPage, StatusBadge, Tabs } from "../../components/portal/Portal";
import { formatDate } from "../../utils/format";
import AttendanceTab from "./cohort/AttendanceTab";
import AssignmentsTab from "./cohort/AssignmentsTab";
import ProgressTab from "./cohort/ProgressTab";
import { cohortKeys } from "./cohort/queryKeys";

type CohortTab = "sessions" | "assignments" | "progress";

const TABS: { id: CohortTab; label: string }[] = [
  { id: "sessions", label: "Sessions & Attendance" },
  { id: "assignments", label: "Assignments" },
  { id: "progress", label: "Roster & Progress" },
];

export default function CohortPage() {
  const { offeringId = "" } = useParams<{ offeringId: string }>();
  const [tab, setTab] = useState<CohortTab>("sessions");

  const { data, isLoading, error } = useQuery({
    queryKey: cohortKeys.detail(offeringId),
    queryFn: ({ signal }) => instructorApi.getCohort(offeringId, signal),
    enabled: !!offeringId,
  });

  return (
    <PortalPage
      eyebrow="Instructor Portal"
      title={data?.cohort.courseTitle ?? "Cohort"}
      subtitle={
        data ? (
          <>
            {formatDate(data.cohort.startsAt)} – {formatDate(data.cohort.endsAt)} · {data.cohort.learnerCount} learners ·{" "}
            <StatusBadge status={data.cohort.status} />
          </>
        ) : undefined
      }
      backTo="/instructor"
      backLabel="All cohorts"
    >
      <ErrorAlert error={error} />
      {isLoading && <LoadingState label="Loading cohort…" />}
      {data && (
        <>
          <Tabs tabs={TABS} active={tab} onChange={setTab} label="Cohort sections" />
          {tab === "sessions" && <AttendanceTab offeringId={offeringId} sessions={data.sessions} />}
          {tab === "assignments" && <AssignmentsTab offeringId={offeringId} assignments={data.assignments} />}
          {tab === "progress" && <ProgressTab offeringId={offeringId} />}
        </>
      )}
    </PortalPage>
  );
}
