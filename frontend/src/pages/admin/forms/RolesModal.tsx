import { FormEvent, useState } from "react";
import { ErrorAlert, Modal } from "../../../components/portal/Portal";
import { adminApi } from "../../../services/api/adminApi";
import type { AdminUserDto } from "../../../types/operations";
import { adminKeys, useAdminMutation } from "../adminShared";

const ROLES = ["Learner", "Instructor", "Admin", "ContentManager"] as const;

export default function RolesModal({ user, onClose }: { user: AdminUserDto; onClose: () => void }) {
  const [roles, setRoles] = useState<string[]>(user.roles);

  const save = useAdminMutation(
    (next: string[]) => adminApi.setUserRoles(user.id, next),
    [adminKeys.all],
    onClose,
  );

  const toggle = (role: string) =>
    setRoles((current) => (current.includes(role) ? current.filter((r) => r !== role) : [...current, role]));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    save.mutate(roles);
  };

  return (
    <Modal title={`Roles for ${user.firstName} ${user.lastName}`} onClose={onClose}>
      <ErrorAlert error={save.error} />
      <div className="portal-alert portal-alert-info">Saving signs the user out so the new permissions apply at their next login.</div>
      <form className="portal-form" onSubmit={submit}>
        <fieldset style={{ border: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
          <legend className="portal-label" style={{ marginBottom: 6 }}>
            Roles
          </legend>
          {ROLES.map((role) => (
            <label key={role} className="portal-checkbox">
              <input type="checkbox" checked={roles.includes(role)} onChange={() => toggle(role)} />
              {role}
            </label>
          ))}
        </fieldset>
        <div className="portal-row" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="portal-btn portal-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="portal-btn" disabled={save.isPending || roles.length === 0}>
            {save.isPending ? "Saving…" : "Save roles"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
