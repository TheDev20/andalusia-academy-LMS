import { useQuery } from "@tanstack/react-query";
import { instructorApi } from "../../../services/api/instructorApi";
import { EmptyState, ErrorAlert, LoadingState, ProgressBar } from "../../../components/portal/Portal";
import { cohortKeys } from "./queryKeys";

export default function ProgressTab({ offeringId }: { offeringId: string }) {
  const { data: rows = [], isLoading, error } = useQuery({
    queryKey: cohortKeys.progress(offeringId),
    queryFn: ({ signal }) => instructorApi.getProgress(offeringId, signal),
  });

  if (isLoading) return <LoadingState label="Loading learner progress…" />;

  return (
    <>
      <ErrorAlert error={error} />
      {rows.length === 0 && !error ? (
        <EmptyState title="No learners enrolled yet" />
      ) : (
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th scope="col">Learner</th>
                <th scope="col">Email</th>
                <th scope="col" style={{ minWidth: 180 }}>Overall</th>
                <th scope="col">Resources</th>
                <th scope="col">Attendance</th>
                <th scope="col">Assignments</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.learningEnrollmentId}>
                  <td>{row.learnerName}</td>
                  <td>{row.email}</td>
                  <td>
                    <ProgressBar percent={row.progress.overallPercent} label={`Overall progress for ${row.learnerName}`} />
                  </td>
                  <td>
                    {row.progress.completedResources}/{row.progress.requiredResources}
                  </td>
                  <td>
                    {row.progress.sessionsAttended}/{row.progress.sessionsHeld}
                  </td>
                  <td>
                    {row.progress.assignmentsSubmitted}/{row.progress.assignments}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
