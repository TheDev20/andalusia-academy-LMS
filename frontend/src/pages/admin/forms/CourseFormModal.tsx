import { FormEvent, useState } from "react";
import { ErrorAlert, Field, Modal } from "../../../components/portal/Portal";
import { adminApi } from "../../../services/api/adminApi";
import type { AdminCourseDto, UpsertCourseRequest } from "../../../types/operations";
import { adminKeys, slugify, useAdminMutation } from "../adminShared";

const STATUSES: UpsertCourseRequest["publicationStatus"][] = ["Draft", "Published", "Archived"];

export default function CourseFormModal({ course, onClose }: { course?: AdminCourseDto; onClose: () => void }) {
  const [form, setForm] = useState<UpsertCourseRequest>({
    title: course?.title ?? "",
    slug: course?.slug ?? "",
    description: course?.description ?? "",
    publicationStatus: course?.publicationStatus ?? "Draft",
  });
  const [slugTouched, setSlugTouched] = useState(!!course);

  const save = useAdminMutation(
    (request: UpsertCourseRequest) => (course ? adminApi.updateCourse(course.id, request) : adminApi.createCourse(request)),
    [adminKeys.courses, adminKeys.offerings],
    onClose,
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    save.mutate({ ...form, title: form.title.trim(), slug: form.slug.trim(), description: form.description.trim() });
  };

  return (
    <Modal title={course ? "Edit course" : "New course"} onClose={onClose}>
      <ErrorAlert error={save.error} />
      <form className="portal-form" onSubmit={submit}>
        <Field label="Title">
          {(id) => (
            <input
              id={id}
              className="portal-input"
              required
              maxLength={250}
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value, slug: slugTouched ? f.slug : slugify(e.target.value) }))
              }
            />
          )}
        </Field>
        <Field label="Slug (lowercase-kebab-case)">
          {(id) => (
            <input
              id={id}
              className="portal-input"
              required
              maxLength={160}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              title="Lowercase letters and numbers separated by single hyphens"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setForm((f) => ({ ...f, slug: e.target.value }));
              }}
            />
          )}
        </Field>
        <Field label="Description">
          {(id) => (
            <textarea
              id={id}
              className="portal-textarea"
              required
              maxLength={8000}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          )}
        </Field>
        <Field label="Publication status">
          {(id) => (
            <select
              id={id}
              className="portal-select"
              value={form.publicationStatus}
              onChange={(e) => setForm((f) => ({ ...f, publicationStatus: e.target.value as UpsertCourseRequest["publicationStatus"] }))}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
        </Field>
        <div className="portal-row" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="portal-btn portal-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="portal-btn" disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save course"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
