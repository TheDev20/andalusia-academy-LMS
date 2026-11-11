import { useState } from "react";
import { Download, FileText, Loader2, Trash2 } from "lucide-react";
import { filesApi } from "../../services/api/filesApi";
import { formatFileSize, type FileDto } from "../../types/files";
import "./files.css";

/** Stored files with an authenticated download button each, and an optional remove action for editors. */
export default function FileList({
  files,
  label = "Files",
  onRemove,
  removing = false,
}: {
  files: FileDto[];
  label?: string;
  onRemove?: (file: FileDto) => void;
  removing?: boolean;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (files.length === 0) return null;

  const download = async (file: FileDto) => {
    setError(null);
    setBusyId(file.id);
    try {
      await filesApi.download(file);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The file could not be downloaded.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <ul className="file-list" aria-label={label}>
        {files.map((file) => (
          <li key={file.id} className="file-list-item">
            <FileText size={18} aria-hidden="true" className="file-list-icon" />
            <span className="file-list-name">{file.fileName}</span>
            <span className="file-list-size">{formatFileSize(file.sizeBytes)}</span>
            <button
              type="button"
              className="portal-btn portal-btn-secondary portal-btn-sm"
              onClick={() => download(file)}
              disabled={busyId === file.id}
              aria-label={`Download ${file.fileName}`}
            >
              {busyId === file.id ? (
                <Loader2 size={14} className="portal-spin" aria-hidden="true" />
              ) : (
                <Download size={14} aria-hidden="true" />
              )}
              Download
            </button>
            {onRemove && (
              <button
                type="button"
                className="portal-btn portal-btn-danger portal-btn-sm"
                onClick={() => onRemove(file)}
                disabled={removing}
                aria-label={`Remove ${file.fileName}`}
              >
                <Trash2 size={14} aria-hidden="true" />
              </button>
            )}
          </li>
        ))}
      </ul>
      {error && (
        <p className="file-picker-errors" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
