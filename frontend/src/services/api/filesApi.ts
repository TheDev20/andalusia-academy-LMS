import { apiBlob } from "./httpClient";
import type { FileDto } from "../../types/files";

export const filesApi = {
  /**
   * Downloads a stored file. The API needs the bearer token, so a plain link cannot be used: the content is fetched
   * with the token and saved through a temporary object URL.
   */
  async download(file: Pick<FileDto, "id" | "fileName">): Promise<void> {
    const blob = await apiBlob(`/api/files/${file.id}`);
    const url = URL.createObjectURL(blob);
    try {
      const link = document.createElement("a");
      link.href = url;
      link.download = file.fileName;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      // Give the browser a moment to start the download before releasing the blob.
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    }
  },
};
