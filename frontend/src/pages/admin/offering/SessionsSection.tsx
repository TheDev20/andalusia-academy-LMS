import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { EmptyState, ErrorAlert, LoadingState, StatusBadge } from "../../../components/portal/Portal";
import { adminApi } from "../../../services/api/adminApi";
import type { AdminSessionDto } from "../../../types/operations";
import { formatDateTime } from "../../../utils/format";
import { adminKeys, useAdminMutation } from "../adminShared";
import SessionFormModal from "../forms/SessionFormModal";

export default function SessionsSection({ offeringId }: { offeringId: string }) {
  const [editing, setEditing] = useState<AdminSessionDto | "new" | null>(null);

  const sessions = useQuery({
    queryKey: adminKeys.sessions(offeringId),
    queryFn: ({ signal }) => adminApi.listSessions(offeringId, signal),
  });

  const remove = useAdminMutation((id: string) => adminApi.deleteSession(id), [adminKeys.sessions(offeringId)]);

  return (
    <section aria-labelledby="offering-sessions-title">
      <div className="portal-row-between">
        <h2 className="portal-section-title" id="offering-sessions-title">
          Sessions
        </h2>
        <button type="button" className="portal-btn portal-btn-secondary portal-btn-sm" onClick={() => setEditing("new")}>
          <Plus size={14} aria-hidden="true" /> New session
        </button>
      </div>
      <ErrorAlert error={sessions.error ?? remove.error} />
      {sessions.isLoading ? (
        <LoadingState label="Loading sessions…" />
      ) : !sessions.data || sessions.data.length === 0 ? (
        <EmptyState title="No sessions scheduled" />
      ) : (
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Starts</th>
                <th scope="col">Ends</th>
                <th scope="col">Location</th>
                <th scope="col">Status</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sessions.data.map((s) => (
                <tr key={s.id}>
                  <td>{s.title}</td>
                  <td>{formatDateTime(s.startsAt)}</td>
                  <td>{formatDateTime(s.endsAt)}</td>
                  <td>{s.locationName ?? "—"}</td>
                  <td>
                    <StatusBadge status={s.status} />
                  </td>
                  <td>
                    <div className="portal-row" style={{ flexWrap: "nowrap" }}>
                      <button type="button" className="portal-btn portal-btn-secondary portal-btn-sm" onClick={() => setEditing(s)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="portal-btn portal-btn-danger portal-btn-sm"
                        disabled={remove.isPending}
                        onClick={() => window.confirm(`Delete session "${s.title}"?`) && remove.mutate(s.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editing && (
        <SessionFormModal offeringId={offeringId} session={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} />
      )}
    </section>
  );
}
