import { FormEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ErrorAlert, Field, Modal } from "../../../components/portal/Portal";
import { adminApi } from "../../../services/api/adminApi";
import { SESSION_STATUSES, type AdminSessionDto, type SessionStatus, type UpsertSessionRequest } from "../../../types/operations";
import { fromDateTimeLocal, toDateTimeLocal } from "../../../utils/format";
import { adminKeys, useAdminMutation } from "../adminShared";

export default function SessionFormModal({
  offeringId,
  session,
  onClose,
}: {
  offeringId: string;
  session?: AdminSessionDto;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title: session?.title ?? "",
    startsAt: toDateTimeLocal(session?.startsAt),
    endsAt: toDateTimeLocal(session?.endsAt),
    locationId: session?.locationId ?? "",
    status: (session?.status ?? "Scheduled") as SessionStatus,
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const locations = useQuery({
    queryKey: adminKeys.locations,
    queryFn: ({ signal }) => adminApi.listLocations(signal),
  });

  const save = useAdminMutation(
    (request: UpsertSessionRequest) =>
      session ? adminApi.updateSession(session.id, request) : adminApi.createSession(offeringId, request),
    [adminKeys.sessions(offeringId)],
    onClose,
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!form.startsAt || !form.endsAt || new Date(form.endsAt) <= new Date(form.startsAt)) {
      setLocalError("The end time must be after the start time.");
      return;
    }
    save.mutate({
      title: form.title.trim(),
      startsAt: fromDateTimeLocal(form.startsAt),
      endsAt: fromDateTimeLocal(form.endsAt),
      locationId: form.locationId || null,
      status: form.status,
    });
  };

  return (
    <Modal title={session ? "Edit session" : "New session"} onClose={onClose}>
      <ErrorAlert error={localError ?? save.error ?? locations.error} />
      <form className="portal-form" onSubmit={submit}>
        <Field label="Title">
          {(id) => (
            <input id={id} className="portal-input" required maxLength={250} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          )}
        </Field>
        <div className="portal-form-grid">
          <Field label="Starts at">
            {(id) => (
              <input id={id} type="datetime-local" className="portal-input" required value={form.startsAt} onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))} />
            )}
          </Field>
          <Field label="Ends at">
            {(id) => (
              <input id={id} type="datetime-local" className="portal-input" required value={form.endsAt} onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))} />
            )}
          </Field>
          <Field label="Location">
            {(id) => (
              <select id={id} className="portal-select" value={form.locationId} onChange={(e) => setForm((f) => ({ ...f, locationId: e.target.value }))}>
                <option value="">No location</option>
                {locations.data?.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Status">
            {(id) => (
              <select id={id} className="portal-select" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as SessionStatus }))}>
                {SESSION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}
          </Field>
        </div>
        <div className="portal-row" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="portal-btn portal-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="portal-btn" disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save session"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
