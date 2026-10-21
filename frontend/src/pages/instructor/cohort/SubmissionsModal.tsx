import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instructorApi } from "../../../services/api/instructorApi";
import { EmptyState, ErrorAlert, LoadingState, Modal, SuccessAlert } from "../../../components/portal/Portal";
import { formatDateTime } from "../../../utils/format";
import type { InstructorAssignmentDto, SubmissionForGradingDto } from "../../../types/learning";
import { cohortKeys } from "./queryKeys";

export default function SubmissionsModal({
  offeringId,
  assignment,
  onClose,
}: {
  offeringId: string;
  assignment: InstructorAssignmentDto;
  onClose: () => void;
}) {
  const { data: submissions = [], isLoading, error } = useQuery({
    queryKey: cohortKeys.submissions(assignment.id),
    queryFn: ({ signal }) => instructorApi.getSubmissions(assignment.id, signal),
  });

  return (
    <Modal title={`Submissions — ${assignment.title}`} onClose={onClose}>
      <ErrorAlert error={error} />
      {isLoading ? (
        <LoadingState label="Loading submissions…" />
      ) : submissions.length === 0 && !error ? (
        <EmptyState title="No submissions yet" />
      ) : (
        <div className="portal-stack">
          {submissions.map((submission) => (
            <SubmissionCard key={submission.id} offeringId={offeringId} assignment={assignment} submission={submission} />
          ))}
        </div>
      )}
    </Modal>
  );
}

function SubmissionCard({
  offeringId,
  assignment,
  submission,
}: {
  offeringId: string;
  assignment: InstructorAssignmentDto;
  submission: SubmissionForGradingDto;
}) {
  const queryClient = useQueryClient();
  const [score, setScore] = useState(submission.score != null ? String(submission.score) : "");
  const [saved, setSaved] = useState<string | null>(null);

  const grade = useMutation({
    mutationFn: (value: number) => instructorApi.grade(submission.id, value),
    onSuccess: (updated) => {
      setSaved(`Graded ${updated.score} / ${assignment.maxScore}.`);
      queryClient.invalidateQueries({ queryKey: cohortKeys.submissions(assignment.id) });
      queryClient.invalidateQueries({ queryKey: cohortKeys.detail(offeringId) });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(null);
    grade.mutate(Number(score));
  };

  const inputId = `score-${submission.id}`;

  return (
    <article className="portal-card" style={{ padding: 16 }}>
      <div className="portal-row-between">
        <strong style={{ color: "#271e16" }}>{submission.learnerName}</strong>
        <span className="portal-card-meta">
          Attempt {submission.attemptNumber} · {formatDateTime(submission.submittedAt)}
        </span>
      </div>
      <div
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: "#faf8f4",
          border: "1px solid #efe9df",
          borderRadius: 10,
          padding: "10px 12px",
          margin: "10px 0",
          fontSize: 14,
          color: "#43392f",
          maxHeight: 240,
          overflowY: "auto",
        }}
      >
        {submission.body || <em>No text submitted.</em>}
      </div>
      <ErrorAlert error={grade.error} />
      <SuccessAlert message={saved} />
      <form className="portal-row" onSubmit={handleSubmit}>
        <label htmlFor={inputId} className="portal-label">
          Score (max {assignment.maxScore})
        </label>
        <input
          id={inputId}
          type="number"
          className="portal-input"
          style={{ width: 110 }}
          min={0}
          max={assignment.maxScore}
          step="0.01"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          required
        />
        <button type="submit" className="portal-btn portal-btn-sm" disabled={grade.isPending || score === ""}>
          {grade.isPending ? "Saving…" : "Save grade"}
        </button>
        {submission.gradedAt && <span className="portal-card-meta">Last graded {formatDateTime(submission.gradedAt)}</span>}
      </form>
    </article>
  );
}
