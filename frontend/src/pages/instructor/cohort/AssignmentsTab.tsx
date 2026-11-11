import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { instructorApi } from "../../../services/api/instructorApi";
import { EmptyState, ErrorAlert, Field, Modal, StatusBadge } from "../../../components/portal/Portal";
import FileList from "../../../components/files/FileList";
import FilePicker from "../../../components/files/FilePicker";
import { MAX_FILES_PER_OWNER, MAX_FILES_PER_UPLOAD, type FileDto } from "../../../types/files";
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
          <Plus size={16} aria-hidden="true" /> New assignment
        </button>
      </div>

      {assignments.length === 0 ? (
        <EmptyState title="No assignments yet">Create the first assignment for this cohort.</EmptyState>
      ) : (
        <div className="portal-table-wrap" tabIndex={0}>
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
  const [files, setFiles] = useState<File[]>([]);
  const [existing, setExisting] = useState<FileDto[]>(assignment?.files ?? []);
  // After the first successful save of a new assignment, a retry (e.g. after a failed upload) updates it instead of creating a duplicate.
  const [createdId, setCreatedId] = useState<string | null>(null);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: cohortKeys.detail(offeringId) });
    queryClient.invalidateQueries({ queryKey: cohortKeys.progress(offeringId) });
    queryClient.invalidateQueries({ queryKey: cohortKeys.cohorts });
  };

  const save = useMutation({
    mutationFn: async (request: UpsertAssignmentRequest) => {
      const targetId = assignment?.id ?? createdId;
      const saved = targetId
        ? await instructorApi.updateAssignment(targetId, request)
        : await instructorApi.createAssignment(offeringId, request);
      if (!targetId) setCreatedId(saved.id);
      if (files.length > 0) await instructorApi.uploadAssignmentFiles(saved.id, files);
      return saved;
    },
    onSuccess: () => {
      refresh();
      onClose();
    },
  });

  const removeFile = useMutation({
    mutationFn: (file: FileDto) => instructorApi.deleteAssignmentFile(assignment!.id, file.id),
    onSuccess: (updated) => {
      setExisting(updated.files);
      refresh();
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

  const room = MAX_FILES_PER_OWNER - existing.length;

  return (
    <Modal title={assignment ? "Edit assignment" : "New assignment"} onClose={onClose}>
      <ErrorAlert error={save.error ?? removeFile.error} />
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
              placeholder="Provide assignment brief, rubrics, expectations or questions..."
            />
          )}
        </Field>

        <div className="portal-field">
          <span className="portal-label">Attachments (brief, questions sheet, data files)</span>
          {existing.length > 0 && (
            <FileList
              files={existing}
              label="Attached files"
              removing={removeFile.isPending}
              onRemove={(file) =>
                window.confirm(`Remove "${file.fileName}"? Learners will no longer be able to download it.`) && removeFile.mutate(file)
              }
            />
          )}
          {room > 0 ? (
            <FilePicker
              files={files}
              onChange={setFiles}
              disabled={save.isPending}
              maxFiles={Math.min(MAX_FILES_PER_UPLOAD, room)}
              label="Attach files"
            />
          ) : (
            <p className="portal-card-meta">This assignment already holds the maximum of {MAX_FILES_PER_OWNER} files.</p>
          )}
        </div>

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
            {save.isPending
              ? files.length > 0
                ? "Saving and uploading…"
                : "Saving…"
              : assignment
                ? "Save changes"
                : "Create assignment"}
          </button>
          <button type="button" className="portal-btn portal-btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
