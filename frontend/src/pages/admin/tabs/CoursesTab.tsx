import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { EmptyState, ErrorAlert, LoadingState, StatusBadge } from "../../../components/portal/Portal";
import { adminApi } from "../../../services/api/adminApi";
import { ApiError } from "../../../services/api/httpClient";
import type { AdminCourseDto } from "../../../types/operations";
import { adminKeys, Pagination, SearchBar, useAdminMutation } from "../adminShared";
import CourseFormModal from "../forms/CourseFormModal";

const PAGE_SIZE = 20;

export default function CoursesTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<AdminCourseDto | "new" | null>(null);

  const courses = useQuery({
    queryKey: [...adminKeys.courses, search, page],
    queryFn: ({ signal }) => adminApi.listCourses({ search, pageNumber: page, pageSize: PAGE_SIZE }, signal),
    placeholderData: keepPreviousData,
  });

  const remove = useAdminMutation((id: string) => adminApi.deleteCourse(id), [adminKeys.courses]);

  const deleteError =
    remove.error instanceof ApiError && remove.error.status === 409
      ? new Error(`${remove.error.message} Set its publication status to "Archived" to hide it instead.`)
      : remove.error;

  return (
    <section aria-label="Courses">
      <div className="portal-row-between" style={{ marginBottom: 14 }}>
        <SearchBar
          label="Search courses by title or slug"
          onSearch={(term) => {
            setSearch(term);
            setPage(1);
          }}
        />
        <button type="button" className="portal-btn" onClick={() => setEditing("new")}>
          <Plus size={15} aria-hidden="true" /> New course
        </button>
      </div>

      <ErrorAlert error={courses.error ?? deleteError} />

      {courses.isLoading ? (
        <LoadingState label="Loading courses…" />
      ) : !courses.data || courses.data.items.length === 0 ? (
        <EmptyState title="No courses found" />
      ) : (
        <>
          <div className="portal-table-wrap">
            <table className="portal-table">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Slug</th>
                  <th scope="col">Status</th>
                  <th scope="col">Offerings</th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.data.items.map((c) => (
                  <tr key={c.id}>
                    <td>{c.title}</td>
                    <td>
                      <code>{c.slug}</code>
                    </td>
                    <td>
                      <StatusBadge status={c.publicationStatus} />
                    </td>
                    <td>{c.offeringCount}</td>
                    <td>
                      <div className="portal-row" style={{ flexWrap: "nowrap" }}>
                        <button type="button" className="portal-btn portal-btn-secondary portal-btn-sm" onClick={() => setEditing(c)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="portal-btn portal-btn-danger portal-btn-sm"
                          disabled={remove.isPending}
                          onClick={() => window.confirm(`Delete "${c.title}"? This cannot be undone.`) && remove.mutate(c.id)}
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
          <Pagination pageNumber={courses.data.pageNumber} totalPages={courses.data.totalPages} onChange={setPage} />
        </>
      )}

      {editing && <CourseFormModal course={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} />}
    </section>
  );
}
