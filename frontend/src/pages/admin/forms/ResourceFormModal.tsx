import { FormEvent, useState } from "react";
import { ErrorAlert, Field, Modal } from "../../../components/portal/Portal";
import FileList from "../../../components/files/FileList";
import FilePicker from "../../../components/files/FilePicker";
import { adminApi } from "../../../services/api/adminApi";
import { MAX_FILES_PER_OWNER, MAX_FILES_PER_UPLOAD, type FileDto } from "../../../types/files";
import type { AdminResourceDto, UpsertResourceRequest } from "../../../types/operations";
import { adminKeys, useAdminMutation } from "../adminShared";

export default function ResourceFormModal({
  offeringId,
  resource,
  nextSequence,
  onClose,
}: {
  offeringId: string;
  resource?: AdminResourceDto;
  nextSequence: number;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title: resource?.title ?? "",
    url: resource?.url ?? "",
    required: resource?.required ?? true,
    sequence: String(resource?.sequence ?? nextSequence),
  });
  const [files, setFiles] = useState<File[]>([]);
  const [existing, setExisting] = useState<FileDto[]>(resource?.files ?? []);
  // After the first successful save of a new material, a retry (e.g. after a failed upload) updates it instead of creating a duplicate.
  const [createdId, setCreatedId] = useState<string | null>(null);

  const save = useAdminMutation(
    async (request: UpsertResourceRequest) => {
      const targetId = resource?.id ?? createdId;
      const saved = targetId
        ? await adminApi.updateResource(targetId, request)
        : await adminApi.createResource(offeringId, request);
      if (!targetId) setCreatedId(saved.id);
      if (files.length > 0) await adminApi.uploadResourceFiles(saved.id, files);
      return saved;
    },
    [adminKeys.resources(offeringId)],
    onClose,
  );

  const removeFile = useAdminMutation(
    (file: FileDto) => adminApi.deleteResourceFile(resource!.id, file.id),
    [adminKeys.resources(offeringId)],
    (updated) => setExisting(updated.files),
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    save.mutate({
      title: form.title.trim(),
      url: form.url.trim() || null,
      required: form.required,
      sequence: Number(form.sequence),
    });
  };

  const room = MAX_FILES_PER_OWNER - existing.length;

  return (
    <Modal title={resource ? "Edit learning material" : "New learning material"} onClose={onClose}>
      <ErrorAlert error={save.error ?? removeFile.error} />
      <form className="portal-form" onSubmit={submit}>
        <Field label="Title">
          {(id) => (
            <input id={id} className="portal-input" required maxLength={250} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          )}
        </Field>
        <Field label="Link (optional)">
          {(id) => (
            <input id={id} type="url" className="portal-input" maxLength={1000} placeholder="https://…" value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} />
          )}
        </Field>

        <div className="portal-field">
          <span className="portal-label">Documents (optional)</span>
          {existing.length > 0 && (
            <FileList
              files={existing}
              label="Uploaded documents"
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
              label="Choose documents"
            />
          ) : (
            <p className="portal-card-meta">This material already holds the maximum of {MAX_FILES_PER_OWNER} files.</p>
          )}
        </div>

        <div className="portal-form-grid">
          <Field label="Sequence">
            {(id) => (
              <input id={id} type="number" min={0} max={10000} className="portal-input" required value={form.sequence} onChange={(e) => setForm((f) => ({ ...f, sequence: e.target.value }))} />
            )}
          </Field>
          <label className="portal-checkbox" style={{ alignSelf: "end", paddingBottom: 10 }}>
            <input type="checkbox" checked={form.required} onChange={(e) => setForm((f) => ({ ...f, required: e.target.checked }))} />
            Required for progress
          </label>
        </div>
        <div className="portal-row" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="portal-btn portal-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="portal-btn" disabled={save.isPending}>
            {save.isPending ? (files.length > 0 ? "Saving and uploading…" : "Saving…") : "Save material"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
