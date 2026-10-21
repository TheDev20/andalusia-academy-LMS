import { FormEvent, useState } from "react";
import { ErrorAlert, Field, Modal } from "../../../components/portal/Portal";
import { adminApi } from "../../../services/api/adminApi";
import type { CreateInstructorRequest } from "../../../types/operations";
import { adminKeys, useAdminMutation } from "../adminShared";

export default function InstructorFormModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<CreateInstructorRequest>({
    firstName: "",
    lastName: "",
    email: "",
    temporaryPassword: "",
    biography: "",
  });

  const save = useAdminMutation(
    (request: CreateInstructorRequest) => adminApi.createInstructor(request),
    [adminKeys.users("Instructor")],
    onClose,
  );

  const set = (key: keyof CreateInstructorRequest, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    save.mutate({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      temporaryPassword: form.temporaryPassword,
      biography: form.biography?.trim() || null,
    });
  };

  return (
    <Modal title="New instructor" onClose={onClose}>
      <ErrorAlert error={save.error} />
      <form className="portal-form" onSubmit={submit}>
        <div className="portal-form-grid">
          <Field label="First name">
            {(id) => <input id={id} className="portal-input" required maxLength={100} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />}
          </Field>
          <Field label="Last name">
            {(id) => <input id={id} className="portal-input" required maxLength={100} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />}
          </Field>
        </div>
        <Field label="E-mail">
          {(id) => <input id={id} type="email" className="portal-input" required maxLength={256} autoComplete="off" value={form.email} onChange={(e) => set("email", e.target.value)} />}
        </Field>
        <Field label="Temporary password (min. 8 characters)">
          {(id) => (
            <input id={id} type="password" className="portal-input" required minLength={8} maxLength={128} autoComplete="new-password" value={form.temporaryPassword} onChange={(e) => set("temporaryPassword", e.target.value)} />
          )}
        </Field>
        <Field label="Biography">
          {(id) => <textarea id={id} className="portal-textarea" maxLength={4000} value={form.biography ?? ""} onChange={(e) => set("biography", e.target.value)} />}
        </Field>
        <div className="portal-row" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="portal-btn portal-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="portal-btn" disabled={save.isPending}>
            {save.isPending ? "Creating…" : "Create instructor"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
