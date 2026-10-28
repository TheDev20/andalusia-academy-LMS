import { FormEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ErrorAlert, Field, Modal } from "../../../components/portal/Portal";
import { adminApi } from "../../../services/api/adminApi";
import { OFFERING_STATUSES, type AdminOfferingDto, type OfferingStatus, type UpsertOfferingRequest } from "../../../types/operations";
import { fromDateTimeLocal, toDateTimeLocal } from "../../../utils/format";
import { adminKeys, useAdminMutation } from "../adminShared";

interface FormState {
  courseId: string;
  startsAt: string;
  endsAt: string;
  timeZoneId: string;
  price: string;
  currency: string;
  capacity: string;
  status: OfferingStatus;
}

export default function OfferingFormModal({
  offering,
  defaultCourseId,
  onClose,
}: {
  offering?: AdminOfferingDto;
  defaultCourseId?: string;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>({
    courseId: offering?.courseId ?? defaultCourseId ?? "",
    startsAt: toDateTimeLocal(offering?.startsAt),
    endsAt: toDateTimeLocal(offering?.endsAt),
    timeZoneId: offering?.timeZoneId ?? "Africa/Cairo",
    price: offering ? String(offering.price) : "0",
    currency: offering?.currency?.trim() ?? "EGP",
    capacity: offering ? String(offering.capacity) : "20",
    status: offering?.status ?? "Planned",
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const courses = useQuery({
    queryKey: [...adminKeys.courses, "all-for-select"],
    queryFn: ({ signal }) => adminApi.listCourses({ pageSize: 100 }, signal),
  });

  const save = useAdminMutation(
    (request: UpsertOfferingRequest) =>
      offering ? adminApi.updateOffering(offering.id, request) : adminApi.createOffering(request),
    [adminKeys.offerings, adminKeys.courses, ["catalog", "courses"]],
    onClose,
  );

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!form.startsAt || !form.endsAt || new Date(form.endsAt) <= new Date(form.startsAt)) {
      setLocalError("The end date must be after the start date.");
      return;
    }
    save.mutate({
      courseId: form.courseId,
      startsAt: fromDateTimeLocal(form.startsAt),
      endsAt: fromDateTimeLocal(form.endsAt),
      timeZoneId: form.timeZoneId.trim(),
      price: Number(form.price),
      currency: form.currency.trim().toUpperCase(),
      capacity: Number(form.capacity),
      status: form.status,
    });
  };

  return (
    <Modal title={offering ? "Edit offering" : "New offering"} onClose={onClose}>
      <ErrorAlert error={localError ?? save.error ?? courses.error} />
      {offering && offering.seatsTaken > 0 && (
        <div className="portal-alert portal-alert-info">
          {offering.seatsTaken} seat(s) are taken — capacity cannot be set below that.
        </div>
      )}
      <form className="portal-form" onSubmit={submit}>
        <Field label="Course">
          {(id) => (
            <select id={id} className="portal-select" required value={form.courseId} onChange={(e) => set("courseId", e.target.value)}>
              <option value="" disabled>
                {courses.isLoading ? "Loading courses…" : "Select a course"}
              </option>
              {courses.data?.items.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          )}
        </Field>
        <div className="portal-form-grid">
          <Field label="Starts at">
            {(id) => (
              <input id={id} type="datetime-local" className="portal-input" required value={form.startsAt} onChange={(e) => set("startsAt", e.target.value)} />
            )}
          </Field>
          <Field label="Ends at">
            {(id) => (
              <input id={id} type="datetime-local" className="portal-input" required value={form.endsAt} onChange={(e) => set("endsAt", e.target.value)} />
            )}
          </Field>
          <Field label="Time zone">
            {(id) => (
              <input id={id} className="portal-input" required maxLength={100} value={form.timeZoneId} onChange={(e) => set("timeZoneId", e.target.value)} />
            )}
          </Field>
          <Field label="Price">
            {(id) => (
              <input id={id} type="number" min={0} step="0.01" className="portal-input" required value={form.price} onChange={(e) => set("price", e.target.value)} />
            )}
          </Field>
          <Field label="Currency">
            {(id) => (
              <input id={id} className="portal-input" required minLength={3} maxLength={3} value={form.currency} onChange={(e) => set("currency", e.target.value)} />
            )}
          </Field>
          <Field label="Capacity">
            {(id) => (
              <input id={id} type="number" min={1} max={10000} className="portal-input" required value={form.capacity} onChange={(e) => set("capacity", e.target.value)} />
            )}
          </Field>
          <Field label="Status">
            {(id) => (
              <select id={id} className="portal-select" value={form.status} onChange={(e) => set("status", e.target.value as OfferingStatus)}>
                {OFFERING_STATUSES.map((s) => (
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
            {save.isPending ? "Saving…" : "Save offering"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
