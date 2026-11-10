import { FormEvent, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UploadCloud } from "lucide-react";
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
    categoryId: course?.categoryId ?? "",
    imageUrl: course?.imageUrl ?? "",
  });
  const [slugTouched, setSlugTouched] = useState(!!course);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image file (PNG, JPG, WebP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image file size must be under 10MB.");
      return;
    }
    try {
      setUploading(true);
      const res = await adminApi.uploadCourseImage(file);
      setForm((f) => ({ ...f, imageUrl: res.url }));
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const disciplines = useQuery({
    queryKey: adminKeys.disciplines,
    queryFn: ({ signal }) => adminApi.listDisciplines(signal),
  });

  const save = useAdminMutation(
    (request: UpsertCourseRequest) => (course ? adminApi.updateCourse(course.id, request) : adminApi.createCourse(request)),
    [adminKeys.courses, adminKeys.offerings, adminKeys.disciplines],
    onClose,
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    save.mutate({
      ...form,
      title: form.title.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      categoryId: form.categoryId || null,
      imageUrl: form.imageUrl?.trim() || null,
    });
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
        <Field label="Tech Discipline / Category">
          {(id) => (
            <select
              id={id}
              className="portal-select"
              value={form.categoryId ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value || null }))}
            >
              <option value="">None (Uncategorized)</option>
              {disciplines.data?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </select>
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

        <Field label="Course Cover Image">
          {() => (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />

              {form.imageUrl ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #e2dacd",
                    backgroundColor: "#fdfbf7",
                  }}
                >
                  <img
                    src={form.imageUrl}
                    alt="Cover preview"
                    style={{
                      width: "120px",
                      height: "70px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      border: "1px solid #dcd4c5",
                      flexShrink: 0,
                    }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.opacity = "0.3";
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <span
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 500,
                        color: "#3d342c",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={form.imageUrl}
                    >
                      {form.imageUrl.startsWith("/api/uploads/") ? "Uploaded custom image" : form.imageUrl}
                    </span>
                    <span style={{ fontSize: "0.74rem", color: "#8a7a68" }}>
                      Cover image set
                    </span>
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.2rem" }}>
                      <button
                        type="button"
                        className="portal-btn portal-btn-secondary portal-btn-sm"
                        style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        className="portal-btn portal-btn-danger portal-btn-sm"
                        style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }}
                        onClick={() => setForm((f) => ({ ...f, imageUrl: null }))}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: isDragging ? "2px dashed #b5833e" : "2px dashed #dbd2c2",
                    backgroundColor: isDragging ? "#faf3e8" : "#fcfaf7",
                    borderRadius: "10px",
                    padding: "1.5rem 1rem",
                    textAlign: "center",
                    cursor: uploading ? "wait" : "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <UploadCloud size={32} color={isDragging ? "#b5833e" : "#8a7a68"} />
                  <div style={{ fontSize: "0.88rem", fontWeight: 500, color: "#3d342c" }}>
                    {uploading ? "Uploading image…" : "Click to browse or drag & drop image"}
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "#8a7a68" }}>
                    Supports PNG, JPG, WebP up to 10MB
                  </div>
                </div>
              )}

              {uploadError && (
                <div style={{ fontSize: "0.8rem", color: "#b91c1c", marginTop: "0.2rem" }}>
                  {uploadError}
                </div>
              )}

              <div style={{ marginTop: "0.3rem" }}>
                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    fontSize: "0.78rem",
                    color: "#8a7a68",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => setShowUrlInput((v) => !v)}
                >
                  {showUrlInput ? "Hide manual URL input" : "Or enter image URL / path manually"}
                </button>
                {showUrlInput && (
                  <input
                    className="portal-input"
                    maxLength={2000}
                    placeholder="/images/GameDevelopment.jpg or https://..."
                    value={form.imageUrl ?? ""}
                    style={{ marginTop: "0.4rem" }}
                    onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value || null }))}
                  />
                )}
              </div>
            </div>
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
