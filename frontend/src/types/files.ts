/** A stored file as returned by the API; content is fetched from GET /api/files/{id}. */
export interface FileDto {
  id: string;
  fileName: string;
  mediaType: string;
  sizeBytes: number;
}

/** Mirrors the server's UploadLimits / UploadedFileValidator; the server remains the authority. */
export const MAX_FILE_BYTES = 25 * 1024 * 1024;
export const MAX_FILES_PER_UPLOAD = 5;
/** Total files one material or assignment brief may hold. */
export const MAX_FILES_PER_OWNER = 10;
export const ALLOWED_EXTENSIONS = [
  ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".txt", ".csv", ".md", ".zip", ".png", ".jpg", ".jpeg",
] as const;
export const FILE_ACCEPT = ALLOWED_EXTENSIONS.join(",");

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extensionOf(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot).toLowerCase() : "";
}

export interface FileSelectionResult {
  accepted: File[];
  errors: string[];
}

/**
 * Adds `incoming` to the already selected files, enforcing type, size, emptiness, duplicates and the file limit.
 * Rejected files are reported by name so the user knows exactly what was skipped.
 */
export function addFiles(current: File[], incoming: File[], maxFiles = MAX_FILES_PER_UPLOAD): FileSelectionResult {
  const accepted = [...current];
  const errors: string[] = [];

  for (const file of incoming) {
    if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(extensionOf(file.name))) {
      errors.push(`"${file.name}" is not an allowed file type.`);
    } else if (file.size === 0) {
      errors.push(`"${file.name}" is empty.`);
    } else if (file.size > MAX_FILE_BYTES) {
      errors.push(`"${file.name}" is larger than ${MAX_FILE_BYTES / (1024 * 1024)} MB.`);
    } else if (accepted.some((f) => f.name === file.name && f.size === file.size)) {
      errors.push(`"${file.name}" is already selected.`);
    } else if (accepted.length >= maxFiles) {
      errors.push(`You can attach at most ${maxFiles} files; "${file.name}" was not added.`);
    } else {
      accepted.push(file);
    }
  }

  return { accepted, errors };
}
