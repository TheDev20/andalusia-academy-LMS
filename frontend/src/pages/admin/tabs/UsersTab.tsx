import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { EmptyState, ErrorAlert, LoadingState, StatusBadge } from "../../../components/portal/Portal";
import { useAuth } from "../../../context/AuthContext";
import { adminApi } from "../../../services/api/adminApi";
import type { AdminUserDto } from "../../../types/operations";
import { formatDate } from "../../../utils/format";
import { adminKeys, Pagination, SearchBar, useAdminMutation } from "../adminShared";
import InstructorFormModal from "../forms/InstructorFormModal";
import RolesModal from "../forms/RolesModal";

const PAGE_SIZE = 20;

export default function UsersTab({ role }: { role: "Learner" | "Instructor" }) {
  const { user: me } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingRoles, setEditingRoles] = useState<AdminUserDto | null>(null);
  const [creating, setCreating] = useState(false);

  const users = useQuery({
    queryKey: [...adminKeys.users(role), search, page],
    queryFn: ({ signal }) => adminApi.listUsers({ role, search, pageNumber: page, pageSize: PAGE_SIZE }, signal),
    placeholderData: keepPreviousData,
  });

  const setStatus = useAdminMutation(
    ({ id, isActive }: { id: string; isActive: boolean }) => adminApi.setUserStatus(id, isActive),
    [adminKeys.all],
  );

  const toggleStatus = (u: AdminUserDto) => {
    if (u.isActive && !window.confirm(`Deactivate ${u.firstName} ${u.lastName}? They will be signed out immediately.`)) return;
    setStatus.mutate({ id: u.id, isActive: !u.isActive });
  };

  const label = role === "Learner" ? "students" : "instructors";

  return (
    <section aria-label={role === "Learner" ? "Students" : "Instructors"}>
      <div className="portal-row-between" style={{ marginBottom: 14 }}>
        <SearchBar
          label={`Search ${label} by name or e-mail`}
          onSearch={(term) => {
            setSearch(term);
            setPage(1);
          }}
        />
        {role === "Instructor" && (
          <button type="button" className="portal-btn" onClick={() => setCreating(true)}>
            <UserPlus size={16} aria-hidden="true" /> New instructor
          </button>
        )}
      </div>

      <ErrorAlert error={users.error ?? setStatus.error} />

      {users.isLoading ? (
        <LoadingState label={`Loading ${label}…`} />
      ) : !users.data || users.data.items.length === 0 ? (
        <EmptyState title={`No ${label} found`} />
      ) : (
        <>
          <div className="portal-table-wrap" tabIndex={0}>
            <table className="portal-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">E-mail</th>
                  <th scope="col">Roles</th>
                  <th scope="col">Status</th>
                  <th scope="col">Joined</th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.data.items.map((u) => (
                  <tr key={u.id}>
                    <td>
                      {u.firstName} {u.lastName}
                    </td>
                    <td>{u.email}</td>
                    <td>{u.roles.join(", ")}</td>
                    <td>
                      <StatusBadge status={u.isActive ? "Active" : "Inactive"} />
                    </td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td>
                      <div className="portal-row" style={{ flexWrap: "nowrap" }}>
                        <button type="button" className="portal-btn portal-btn-secondary portal-btn-sm" onClick={() => setEditingRoles(u)}>
                          Edit roles
                        </button>
                        <button
                          type="button"
                          className={`portal-btn portal-btn-sm ${u.isActive ? "portal-btn-danger" : "portal-btn-secondary"}`}
                          disabled={setStatus.isPending || u.id === me?.id}
                          title={u.id === me?.id ? "You cannot deactivate your own account" : undefined}
                          onClick={() => toggleStatus(u)}
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pageNumber={users.data.pageNumber} totalPages={users.data.totalPages} onChange={setPage} />
        </>
      )}

      {editingRoles && <RolesModal user={editingRoles} onClose={() => setEditingRoles(null)} />}
      {creating && <InstructorFormModal onClose={() => setCreating(false)} />}
    </section>
  );
}
