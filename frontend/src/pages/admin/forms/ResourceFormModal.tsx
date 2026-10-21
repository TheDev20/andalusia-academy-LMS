import { FormEvent, useState } from "react";
import { ErrorAlert, Field, Modal } from "../../../components/portal/Portal";
import { adminApi } from "../../../services/api/adminApi";
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

  const save = useAdminMutation(
    (request: UpsertResourceRequest) =>
      resource ? adminApi.updateResource(resource.id, request) : adminApi.createResource(offeringId, request),
    [adminKeys.resources(offeringId)],
    onClose,
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

  return (
    <Modal title={resource ? "Edit learning material" : "New learning material"} onClose={onClose}>
      <ErrorAlert error={save.error} />
      <form className="portal-form" onSubmit={submit}>
        <Field label="Title">
          {(id) => (
            <input id={id} className="portal-input" required maxLength={250} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          )}
        </Field>
        <Field label="URL">
          {(id) => (
            <input id={id} type="url" className="portal-input" maxLength={1000} placeholder="https://…" value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} />
          )}
        </Field>
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
            {save.isPending ? "Saving…" : "Save material"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
