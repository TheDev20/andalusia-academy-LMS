import { useId, useRef, useState } from "react";
import { FileText, Paperclip, X } from "lucide-react";
import {
  ALLOWED_EXTENSIONS,
  FILE_ACCEPT,
  MAX_FILE_BYTES,
  MAX_FILES_PER_UPLOAD,
  addFiles,
  formatFileSize,
} from "../../types/files";
import "./files.css";

/**
 * Accessible multi-file chooser with drag and drop. It only manages the selection (and validates it client-side);
 * uploading is the caller's job.
 */
export default function FilePicker({
  files,
  onChange,
  disabled = false,
  maxFiles = MAX_FILES_PER_UPLOAD,
  label = "Attach files",
}: {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
  maxFiles?: number;
  label?: string;
}) {
  const inputId = useId();
  const hintId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  const take = (incoming: File[]) => {
    const result = addFiles(files, incoming, maxFiles);
    setErrors(result.errors);
    onChange(result.accepted);
    // Allow re-selecting the same file after removing it.
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (index: number) => {
    setErrors([]);
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="file-picker">
      <div
        className={`file-picker-zone${dragging ? " is-dragging" : ""}${disabled ? " is-disabled" : ""}`}
        onDragOver={(e) => {
          if (disabled) return;
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!disabled) take(Array.from(e.dataTransfer.files));
        }}
      >
        <input
          ref={inputRef}
          id={inputId}
          className="file-picker-input"
          type="file"
          multiple
          accept={FILE_ACCEPT}
          disabled={disabled || files.length >= maxFiles}
          aria-describedby={hintId}
          onChange={(e) => take(Array.from(e.target.files ?? []))}
        />
        <label htmlFor={inputId} className="file-picker-label">
          <Paperclip size={16} aria-hidden="true" />
          <span>{label}</span>
        </label>
        <p id={hintId} className="file-picker-hint">
          or drop files here. Up to {maxFiles} files, {MAX_FILE_BYTES / (1024 * 1024)} MB each (
          {ALLOWED_EXTENSIONS.map((e) => e.slice(1)).join(", ")}).
        </p>
      </div>

      {errors.length > 0 && (
        <ul className="file-picker-errors" role="alert">
          {errors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}

      {files.length > 0 && (
        <ul className="file-list" aria-label="Selected files">
          {files.map((file, index) => (
            <li key={`${file.name}-${file.size}`} className="file-list-item">
              <FileText size={18} aria-hidden="true" className="file-list-icon" />
              <span className="file-list-name">{file.name}</span>
              <span className="file-list-size">{formatFileSize(file.size)}</span>
              <button
                type="button"
                className="file-list-remove"
                onClick={() => remove(index)}
                disabled={disabled}
                aria-label={`Remove ${file.name}`}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
