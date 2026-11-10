import { FormEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ErrorAlert, Field } from "../../../components/portal/Portal";
import { adminApi } from "../../../services/api/adminApi";
import type { AdminOfferingDto } from "../../../types/operations";
import { adminKeys, useAdminMutation } from "../adminShared";

export default function InstructorsSection({ offering }: { offering: AdminOfferingDto }) {
  const [selected, setSelected] = useState("");

  const instructors = useQuery({
    queryKey: [...adminKeys.users("Instructor"), "all-for-select"],
    queryFn: ({ signal }) => adminApi.listUsers({ role: "Instructor", pageSize: 100 }, signal),
  });

  const invalidate = [adminKeys.offering(offering.id), adminKeys.offerings];
  const assign = useAdminMutation((id: string) => adminApi.assignInstructor(offering.id, id), invalidate, () => setSelected(""));
  const unassign = useAdminMutation((id: string) => adminApi.unassignInstructor(offering.id, id), invalidate);

  const assignedIds = new Set(offering.instructors.map((i) => i.instructorId));
  const available = instructors.data?.items.filter((u) => u.isActive && !assignedIds.has(u.id)) ?? [];

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (selected) assign.mutate(selected);
  };

  return (
    <section aria-labelledby="offering-instructors-title">
      <h2 className="portal-section-title" id="offering-instructors-title">
        Instructors
      </h2>
      <ErrorAlert error={assign.error ?? unassign.error ?? instructors.error} />
      <div className="portal-card">
        {offering.instructors.length === 0 ? (
          <p style={{ margin: "0 0 12px", color: "#6f6456" }}>No instructor assigned yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 14px", display: "grid", gap: 8 }}>
            {offering.instructors.map((i) => (
              <li key={i.instructorId} className="portal-row-between">
                <span>
                  <strong>{i.name}</strong> <span style={{ color: "#6f6456" }}>{i.email}</span>
                </span>
                <button
                  type="button"
                  className="portal-btn portal-btn-danger portal-btn-sm"
                  disabled={unassign.isPending}
                  onClick={() => window.confirm(`Remove ${i.name} from this cohort?`) && unassign.mutate(i.instructorId)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <form className="portal-row" onSubmit={submit} style={{ alignItems: "flex-end" }}>
          <Field label="Assign instructor">
            {(id) => (
              <select id={id} className="portal-select" value={selected} onChange={(e) => setSelected(e.target.value)} style={{ minWidth: 240 }}>
                <option value="">{instructors.isLoading ? "Loading…" : "Select an instructor"}</option>
                {available.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} ({u.email})
                  </option>
                ))}
              </select>
            )}
          </Field>
          <button type="submit" className="portal-btn" disabled={!selected || assign.isPending}>
            Assign
          </button>
        </form>
      </div>
    </section>
  );
}
