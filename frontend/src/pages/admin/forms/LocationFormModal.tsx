import { FormEvent, useState } from "react";
import { ErrorAlert, Field, Modal } from "../../../components/portal/Portal";
import { adminApi } from "../../../services/api/adminApi";
import type { AdminLocationDto, UpsertLocationRequest } from "../../../types/operations";
import { adminKeys, useAdminMutation } from "../adminShared";

export default function LocationFormModal({ location, onClose }: { location?: AdminLocationDto; onClose: () => void }) {
  const [form, setForm] = useState({
    name: location?.name ?? "",
    address: location?.address ?? "",
    meetingUrl: location?.meetingUrl ?? "",
  });

  const save = useAdminMutation(
    (request: UpsertLocationRequest) =>
      location ? adminApi.updateLocation(location.id, request) : adminApi.createLocation(request),
    [adminKeys.locations],
    onClose,
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    save.mutate({
      name: form.name.trim(),
      address: form.address.trim() || null,
      meetingUrl: form.meetingUrl.trim() || null,
    });
  };

  return (
    <Modal title={location ? "Edit location" : "New location"} onClose={onClose}>
      <ErrorAlert error={save.error} />
      <form className="portal-form" onSubmit={submit}>
        <Field label="Name">
          {(id) => (
            <input id={id} className="portal-input" required maxLength={200} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          )}
        </Field>
        <Field label="Address">
          {(id) => (
            <input id={id} className="portal-input" maxLength={500} value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
          )}
        </Field>
        <Field label="Meeting URL (online sessions)">
          {(id) => (
            <input id={id} type="url" className="portal-input" maxLength={1000} value={form.meetingUrl} onChange={(e) => setForm((f) => ({ ...f, meetingUrl: e.target.value }))} />
          )}
        </Field>
        <div className="portal-row" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="portal-btn portal-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="portal-btn" disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save location"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
