import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { instructorApi } from "../../../services/api/instructorApi";
import { EmptyState, ErrorAlert, Field, Modal, StatusBadge } from "../../../components/portal/Portal";
import { formatDateTime, fromDateTimeLocal, toDateTimeLocal } from "../../../utils/format";
import {
  ASSIGNMENT_STATUSES,
  type AssignmentStatus,
  type InstructorAssignmentDto,
  type UpsertAssignmentRequest,
} from "../../../types/learning";
import SubmissionsModal from "./SubmissionsModal";
import { cohortKeys } from "./queryKeys";

type EditorState = { mode: "create" } | { mode: "edit"; assignment: InstructorAssignmentDto } | null;

export default function AssignmentsTab({
  offeringId,
  assignments,
}: {
  offeringId: string;
  assignments: InstructorAssignmentDto[];
}) {
  const [editor, setEditor] = useState<EditorState>(null);
  const [grading, setGrading] = useState<InstructorAssignmentDto | null>(null);

  return (
    <>
      <div className="portal-row-between" style={{ marginBottom: 14 }}>
        <p className="portal-card-meta" style={{ margin: 0 }}>
          Draft assignments are hidden from learners; closed assignments stop accepting submissions.
        </p>
        <button type="button" className="portal-btn" onClick={() => setEditor({ mode: "create" })}>
          <Plus size={15} aria-hidden="true" /> New assignment
        </button>
      </div>

      {assignments.length === 0 ? (
        <EmptyState title="No assignments yet">Create the first assignment for this cohort.</EmptyState>
      ) : (
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th scope="col">Assignment</th>
                <th scope="col">Status</th>
                <th scope="col">Due</th>
                <th scope="col">Max score</th>
                <th scope="col">Submissions</th>
                <th scope="col">Ungraded</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td>{assignment.title}</td>
                  <td>
                    <StatusBadge status={assignment.status} />
                  </td>
                  <td>{formatDateTime(assignment.dueAt)}</td>
                  <td>{assignment.maxScore}</td>
                  <td>{assignment.submissionCount}</td>
                  <td>{assignment.ungradedCount}</td>
                  <td>
                    <div className="portal-row" style={{ flexWrap: "nowrap" }}>
                      <button
                        type="button"
                        className="portal-btn portal-btn-secondary portal-btn-sm"
                        onClick={() => setEditor({ mode: "edit", assignment })}
                        aria-label={`Edit ${assignment.title}`}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="portal-btn portal-btn-sm"
                        onClick={() => setGrading(assignment)}
                        aria-label={`Submissions for ${assignment.title}`}
                      >
                        Submissions
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editor && (
        <AssignmentEditor
          offeringId={offeringId}
          assignment={editor.mode === "edit" ? editor.assignment : undefined}
          onClose={() => setEditor(null)}
        />
      )}
      {grading && <SubmissionsModal offeringId={offeringId} assignment={grading} onClose={() => setGrading(null)} />}
    </>
  );
}

function AssignmentEditor({
  offeringId,
  assignment,
  onClose,
}: {
  offeringId: string;
  assignment?: InstructorAssignmentDto;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(assignment?.title ?? "");
  const [instructions, setInstructions] = useState(assignment?.instructions ?? "");
  const [maxScore, setMaxScore] = useState(String(assignment?.maxScore ?? 100));
  const [dueAt, setDueAt] = useState(toDateTimeLocal(assignment?.dueAt));
  const [status, setStatus] = useState<AssignmentStatus>(assignment?.status ?? "Draft");

  const save = useMutation({
    mutationFn: (request: UpsertAssignmentRequest) =>
      assignment
        ? instructorApi.updateAssignment(assignment.id, request)
        : instructorApi.createAssignment(offeringId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cohortKeys.detail(offeringId) });
      queryClient.invalidateQueries({ queryKey: cohortKeys.progress(offeringId) });
      queryClient.invalidateQueries({ queryKey: cohortKeys.cohorts });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    save.mutate({
      title: title.trim(),
      instructions: instructions.trim(),
      maxScore: Number(maxScore),
      dueAt: dueAt ? fromDateTimeLocal(dueAt) : null,
      status,
    });
  };

  return (
    <Modal title={assignment ? "Edit assignment" : "New assignment"} onClose={onClose}>
      <ErrorAlert error={save.error} />
      <form className="portal-form" onSubmit={handleSubmit}>
        <Field label="Title">
          {(id) => (
            <input id={id} className="portal-input" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={250} />
          )}
        </Field>
        <Field label="Instructions">
          {(id) => (
            <textarea
              id={id}
              className="portal-textarea"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
              maxLength={20000}
            />
          )}
        </Field>
        <div className="portal-form-grid">
          <Field label="Max score">
            {(id) => (
              <input
                id={id}
                type="number"
                className="portal-input"
                min={0.01}
                max={10000}
                step="0.01"
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
                required
              />
            )}
          </Field>
          <Field label="Due date (optional)">
            {(id) => (
              <input id={id} type="datetime-local" className="portal-input" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
            )}
          </Field>
          <Field label="Status">
            {(id) => (
              <select id={id} className="portal-select" value={status} onChange={(e) => setStatus(e.target.value as AssignmentStatus)}>
                {ASSIGNMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}
          </Field>
        </div>
        <div className="portal-row">
          <button type="submit" className="portal-btn" disabled={save.isPending}>
            {save.isPending ? "Saving…" : assignment ? "Save changes" : "Create assignment"}
          </button>
          <button type="button" className="portal-btn portal-btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
