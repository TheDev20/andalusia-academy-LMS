import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { learningApi } from "../../../services/api/learningApi";
import type { LearnerAssignmentDto } from "../../../types/learning";
import { EmptyState, ErrorAlert, Field, StatusBadge, SuccessAlert } from "../../../components/portal/Portal";
import { formatDateTime } from "../../../utils/format";
import { courseQueryKey } from "./queryKeys";

export default function AssignmentsTab({ courseOfferingId, assignments }: { courseOfferingId: string; assignments: LearnerAssignmentDto[] }) {
  if (assignments.length === 0) {
    return <EmptyState title="No assignments yet" />;
  }

  return (
    <div className="portal-stack">
      {assignments.map((a) => (
        <AssignmentCard key={a.id} courseOfferingId={courseOfferingId} assignment={a} />
      ))}
    </div>
  );
}

function AssignmentCard({ courseOfferingId, assignment }: { courseOfferingId: string; assignment: LearnerAssignmentDto }) {
  const queryClient = useQueryClient();
  const [body, setBody] = useState("");
  const [saved, setSaved] = useState<string | null>(null);
  const latest = assignment.latestSubmission;
  const isOverdue = !!assignment.dueAt && new Date(assignment.dueAt) < new Date();
  const canSubmit = assignment.status === "Published";

  const submit = useMutation({
    mutationFn: () => learningApi.submitAssignment(assignment.id, body.trim()),
    onSuccess: (submission) => {
      setBody("");
      setSaved(`Attempt ${submission.attemptNumber} submitted.`);
      queryClient.invalidateQueries({ queryKey: courseQueryKey(courseOfferingId) });
      queryClient.invalidateQueries({ queryKey: ["myLearning"] });
    },
  });

  return (
    <article className="portal-card">
      <div className="portal-row-between">
        <h3 className="portal-card-title">{assignment.title}</h3>
        <StatusBadge status={assignment.status} />
      </div>
      <div className="portal-card-meta" style={{ marginBottom: 10 }}>
        <span>Due: {formatDateTime(assignment.dueAt)}{isOverdue && canSubmit ? " (past due)" : ""}</span>
        <span>Max score: {assignment.maxScore}</span>
      </div>
      <p style={{ whiteSpace: "pre-wrap", color: "#43392f", fontSize: 14.5 }}>{assignment.instructions}</p>

      {latest && (
        <div className="portal-alert portal-alert-info">
          <strong>Your latest submission</strong> (attempt {latest.attemptNumber}, {formatDateTime(latest.submittedAt)}) —{" "}
          {latest.gradedAt ? `graded ${latest.score}/${assignment.maxScore}` : "awaiting grading"}
        </div>
      )}

      {canSubmit ? (
        <form
          className="portal-form"
          onSubmit={(e) => {
            e.preventDefault();
            setSaved(null);
            submit.mutate();
          }}
        >
          <SuccessAlert message={saved} />
          <ErrorAlert error={submit.error} />
          <Field label={latest ? "Submit a new attempt" : "Your answer"}>
            {(id) => (
              <textarea id={id} className="portal-textarea" value={body} maxLength={20000} required
                onChange={(e) => setBody(e.target.value)} />
            )}
          </Field>
          <div>
            <button type="submit" className="portal-btn" disabled={submit.isPending || !body.trim()}>
              {submit.isPending ? "Submitting…" : "Submit assignment"}
            </button>
          </div>
        </form>
      ) : (
        <p className="portal-card-meta">This assignment is closed for submissions.</p>
      )}
    </article>
  );
}
