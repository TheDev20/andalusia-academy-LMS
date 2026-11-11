import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, FileText } from "lucide-react";
import { learningApi } from "../../../services/api/learningApi";
import type { LearnerAssignmentDto } from "../../../types/learning";
import { EmptyState, ErrorAlert, Field, StatusBadge, SuccessAlert } from "../../../components/portal/Portal";
import FilePicker from "../../../components/files/FilePicker";
import FileList from "../../../components/files/FileList";
import { formatDateTime } from "../../../utils/format";
import { courseQueryKey } from "./queryKeys";

/** Older assignments embedded a public link in the instructions; new ones use real attachments (see FileList). */
const ATTACHMENT_REGEX = /\n\n📎 Attachment:\s*\[(.*?)\]\((.*?)\)/;

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
  const [files, setFiles] = useState<File[]>([]);
  const [saved, setSaved] = useState<string | null>(null);
  const latest = assignment.latestSubmission;
  const isOverdue = !!assignment.dueAt && new Date(assignment.dueAt) < new Date();
  const canSubmit = assignment.status === "Published";

  const submit = useMutation({
    mutationFn: () => learningApi.submitAssignment(assignment.id, body.trim(), files),
    onSuccess: (submission) => {
      setBody("");
      setFiles([]);
      setSaved(`Attempt ${submission.attemptNumber} submitted.`);
      queryClient.invalidateQueries({ queryKey: courseQueryKey(courseOfferingId) });
      queryClient.invalidateQueries({ queryKey: ["myLearning"] });
    },
  });

  const match = assignment.instructions ? assignment.instructions.match(ATTACHMENT_REGEX) : null;
  const cleanInstructions = match
    ? assignment.instructions.replace(ATTACHMENT_REGEX, "").trim()
    : assignment.instructions;
  const attachment = match ? { name: match[1], url: match[2] } : null;

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
      {cleanInstructions && (
        <p style={{ whiteSpace: "pre-wrap", color: "#43392f", fontSize: 15, marginBottom: 12 }}>
          {cleanInstructions}
        </p>
      )}

      <div style={{ marginBottom: 16 }}>
        <FileList files={assignment.attachments ?? []} label={`Files for ${assignment.title}`} />
      </div>

      {attachment && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          padding: "10px 14px",
          background: "#fbf8f3",
          border: "1px solid #ebd9c8",
          borderRadius: 8,
          marginBottom: 16
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 200 }}>
            <FileText size={24} color="#8a532b" />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#2b2118", wordBreak: "break-all" }}>{attachment.name}</div>
              <div style={{ fontSize: 12, color: "#877464" }}>Assignment questions / attachment</div>
            </div>
          </div>
          <a
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            download={attachment.name}
            className="portal-btn"
            style={{ padding: "6px 12px", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}
          >
            <Download size={14} />
            <span>Download Document</span>
          </a>
        </div>
      )}

      {latest && (
        <div className="portal-alert portal-alert-info">
          <strong>Your latest submission</strong> (attempt {latest.attemptNumber}, {formatDateTime(latest.submittedAt)}) —{" "}
          {latest.gradedAt ? `graded ${latest.score}/${assignment.maxScore}` : "awaiting grading"}
          <FileList files={latest.files ?? []} label="Files in your latest submission" />
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
              <textarea id={id} className="portal-textarea" value={body} maxLength={20000}
                required={files.length === 0}
                placeholder="Write your answer, attach files, or both."
                onChange={(e) => setBody(e.target.value)} />
            )}
          </Field>
          <FilePicker files={files} onChange={setFiles} disabled={submit.isPending} label="Attach files" />
          <div>
            <button type="submit" className="portal-btn" disabled={submit.isPending || (!body.trim() && files.length === 0)}>
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
