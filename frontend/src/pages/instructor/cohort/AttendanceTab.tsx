import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instructorApi } from "../../../services/api/instructorApi";
import {
  EmptyState,
  ErrorAlert,
  LoadingState,
  StatusBadge,
  SuccessAlert,
} from "../../../components/portal/Portal";
import { formatDateTime } from "../../../utils/format";
import {
  ATTENDANCE_STATUSES,
  type AttendanceEntry,
  type AttendanceStatus,
  type InstructorSessionDto,
  type SessionAttendanceDto,
} from "../../../types/learning";
import { cohortKeys } from "./queryKeys";

export default function AttendanceTab({
  offeringId,
  sessions,
}: {
  offeringId: string;
  sessions: InstructorSessionDto[];
}) {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  if (sessions.length === 0) {
    return <EmptyState title="No sessions scheduled">Sessions are scheduled by an administrator.</EmptyState>;
  }

  return (
    <>
      <div className="portal-table-wrap" tabIndex={0}>
        <table className="portal-table">
          <thead>
            <tr>
              <th scope="col">Session</th>
              <th scope="col">Starts</th>
              <th scope="col">Location</th>
              <th scope="col">Status</th>
              <th scope="col">Recorded</th>
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id} aria-selected={session.id === selectedSessionId}>
                <td>{session.title}</td>
                <td>{formatDateTime(session.startsAt)}</td>
                <td>{session.locationName ?? "—"}</td>
                <td>
                  <StatusBadge status={session.status} />
                </td>
                <td>{session.attendanceRecorded}</td>
                <td>
                  <button
                    type="button"
                    className={`portal-btn portal-btn-sm${session.id === selectedSessionId ? "" : " portal-btn-secondary"}`}
                    onClick={() => setSelectedSessionId(session.id)}
                    aria-pressed={session.id === selectedSessionId}
                  >
                    Take attendance
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSessionId && (
        <AttendanceSheet key={selectedSessionId} offeringId={offeringId} sessionId={selectedSessionId} />
      )}
    </>
  );
}

interface DraftRow {
  status: AttendanceStatus | "";
  reason: string;
}

function AttendanceSheet({ offeringId, sessionId }: { offeringId: string; sessionId: string }) {
  const queryClient = useQueryClient();
  const [drafts, setDrafts] = useState<Record<string, DraftRow>>({});
  const [success, setSuccess] = useState<string | null>(null);

  const { data: sheet, isLoading, error } = useQuery({
    queryKey: cohortKeys.attendance(sessionId),
    queryFn: ({ signal }) => instructorApi.getAttendance(sessionId, signal),
  });

  useEffect(() => {
    if (sheet) setDrafts(initialDrafts(sheet));
  }, [sheet]);

  const save = useMutation({
    mutationFn: (records: AttendanceEntry[]) => instructorApi.recordAttendance(sessionId, records),
    onSuccess: (updated, records) => {
      queryClient.setQueryData(cohortKeys.attendance(sessionId), updated);
      queryClient.invalidateQueries({ queryKey: cohortKeys.detail(offeringId) });
      queryClient.invalidateQueries({ queryKey: cohortKeys.progress(offeringId) });
      setSuccess(`Attendance saved for ${records.length} learner${records.length === 1 ? "" : "s"}.`);
    },
  });

  if (isLoading) return <LoadingState label="Loading attendance sheet…" />;
  if (!sheet) return <ErrorAlert error={error} />;

  const changes = sheet.records.flatMap<AttendanceEntry>((record) => {
    const draft = drafts[record.learningEnrollmentId];
    if (!draft || !draft.status || draft.status === record.status) return [];
    return [
      {
        learningEnrollmentId: record.learningEnrollmentId,
        status: draft.status,
        correctionReason: record.status ? draft.reason.trim() || null : null,
      },
    ];
  });

  const updateDraft = (learningEnrollmentId: string, patch: Partial<DraftRow>) => {
    setSuccess(null);
    setDrafts((current) => ({
      ...current,
      [learningEnrollmentId]: { ...current[learningEnrollmentId], ...patch },
    }));
  };

  const handleMarkAllPresent = () => {
    setSuccess(null);
    setDrafts((current) =>
      Object.fromEntries(
        sheet.records.map((r) => [
          r.learningEnrollmentId,
          { ...current[r.learningEnrollmentId], status: current[r.learningEnrollmentId]?.status || "Present" },
        ]),
      ),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    if (changes.length > 0) save.mutate(changes);
  };

  return (
    <section className="portal-card" style={{ marginTop: 18 }} aria-labelledby="attendance-sheet-title">
      <div className="portal-row-between" style={{ marginBottom: 12 }}>
        <div>
          <h2 className="portal-card-title" id="attendance-sheet-title">
            Attendance — {sheet.title}
          </h2>
          <div className="portal-card-meta">{formatDateTime(sheet.startsAt)}</div>
        </div>
        <button type="button" className="portal-btn portal-btn-secondary portal-btn-sm" onClick={handleMarkAllPresent}>
          Mark unrecorded as present
        </button>
      </div>

      <ErrorAlert error={error ?? save.error} />
      <SuccessAlert message={success} />

      {sheet.records.length === 0 ? (
        <EmptyState title="No learners enrolled in this cohort" />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="portal-table-wrap" tabIndex={0}>
            <table className="portal-table">
              <thead>
                <tr>
                  <th scope="col">Learner</th>
                  <th scope="col">Recorded</th>
                  <th scope="col">Status</th>
                  <th scope="col">Correction reason</th>
                </tr>
              </thead>
              <tbody>
                {sheet.records.map((record) => {
                  const draft = drafts[record.learningEnrollmentId] ?? { status: "", reason: "" };
                  const isCorrection = !!record.status && !!draft.status && draft.status !== record.status;
                  return (
                    <tr key={record.learningEnrollmentId}>
                      <td>{record.learnerName}</td>
                      <td>
                        {record.status ? <StatusBadge status={record.status} /> : "—"}
                        {record.recordedAt && (
                          <div className="portal-card-meta">{formatDateTime(record.recordedAt)}</div>
                        )}
                      </td>
                      <td>
                        <select
                          className="portal-select"
                          aria-label={`Attendance for ${record.learnerName}`}
                          value={draft.status}
                          onChange={(e) =>
                            updateDraft(record.learningEnrollmentId, { status: e.target.value as AttendanceStatus | "" })
                          }
                        >
                          <option value="" disabled>
                            Not recorded
                          </option>
                          {ATTENDANCE_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        {isCorrection ? (
                          <input
                            className="portal-input"
                            aria-label={`Correction reason for ${record.learnerName}`}
                            placeholder="Why is this being corrected?"
                            maxLength={1000}
                            value={draft.reason}
                            onChange={(e) => updateDraft(record.learningEnrollmentId, { reason: e.target.value })}
                          />
                        ) : (
                          <span className="portal-card-meta">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="portal-row" style={{ marginTop: 14 }}>
            <button type="submit" className="portal-btn" disabled={save.isPending || changes.length === 0}>
              {save.isPending ? "Saving…" : `Save attendance${changes.length ? ` (${changes.length})` : ""}`}
            </button>
            <span className="portal-card-meta">Corrections to recorded attendance are kept in the audit trail.</span>
          </div>
        </form>
      )}
    </section>
  );
}

function initialDrafts(sheet: SessionAttendanceDto): Record<string, DraftRow> {
  return Object.fromEntries(
    sheet.records.map((r) => [r.learningEnrollmentId, { status: r.status ?? "", reason: "" }]),
  );
}
