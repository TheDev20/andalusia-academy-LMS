import { afterEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import ResourceFormModal from "../pages/admin/forms/ResourceFormModal";
import { adminApi } from "../services/api/adminApi";
import { ApiError } from "../services/api/httpClient";
import type { AdminResourceDto } from "../types/operations";

const saved = (over: Partial<AdminResourceDto> = {}): AdminResourceDto => ({
  id: "r-1", courseOfferingId: "o-1", title: "Notes", url: null, required: true, sequence: 1, files: [], ...over,
});

function renderModal(resource?: AdminResourceDto, onClose = vi.fn()) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <ResourceFormModal offeringId="o-1" resource={resource} nextSequence={1} onClose={onClose} />
    </QueryClientProvider>,
  );
  return onClose;
}

function fill(title: string) {
  fireEvent.change(screen.getByLabelText("Title"), { target: { value: title } });
}

function choose(...files: File[]) {
  fireEvent.change(screen.getByLabelText("Choose documents"), { target: { files } });
}

describe("ResourceFormModal documents", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("creates the material, then uploads the chosen documents and closes", async () => {
    const create = vi.spyOn(adminApi, "createResource").mockResolvedValue(saved());
    const upload = vi.spyOn(adminApi, "uploadResourceFiles").mockResolvedValue(saved());
    const onClose = renderModal();

    fill("Notes");
    choose(new File(["%PDF-1.4"], "notes.pdf"));
    fireEvent.click(screen.getByRole("button", { name: "Save material" }));

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(create).toHaveBeenCalledOnce();
    expect(upload).toHaveBeenCalledWith("r-1", [expect.objectContaining({ name: "notes.pdf" })]);
  });

  it("does not call the upload endpoint when no documents were chosen", async () => {
    vi.spyOn(adminApi, "createResource").mockResolvedValue(saved());
    const upload = vi.spyOn(adminApi, "uploadResourceFiles");
    const onClose = renderModal();

    fill("Link only");
    fireEvent.click(screen.getByRole("button", { name: "Save material" }));

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(upload).not.toHaveBeenCalled();
  });

  it("keeps the dialog open on a failed upload and retries without creating a duplicate material", async () => {
    const create = vi.spyOn(adminApi, "createResource").mockResolvedValue(saved());
    const update = vi.spyOn(adminApi, "updateResource").mockResolvedValue(saved());
    const upload = vi
      .spyOn(adminApi, "uploadResourceFiles")
      .mockRejectedValueOnce(new ApiError(422, "The content of \"notes.pdf\" does not match its .pdf file type."))
      .mockResolvedValueOnce(saved());
    const onClose = renderModal();

    fill("Notes");
    choose(new File(["x"], "notes.pdf"));
    fireEvent.click(screen.getByRole("button", { name: "Save material" }));

    expect((await screen.findByRole("alert")).textContent).toContain("does not match");
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Save material" }));

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(create).toHaveBeenCalledOnce();
    expect(update).toHaveBeenCalledWith("r-1", expect.objectContaining({ title: "Notes" }));
    expect(upload).toHaveBeenCalledTimes(2);
  });

  it("lists uploaded documents of an existing material and removes one after confirmation", async () => {
    const files = [
      { id: "f-1", fileName: "a.pdf", mediaType: "application/pdf", sizeBytes: 10 },
      { id: "f-2", fileName: "b.pdf", mediaType: "application/pdf", sizeBytes: 20 },
    ];
    const remove = vi.spyOn(adminApi, "deleteResourceFile").mockResolvedValue(saved({ files: [files[1]] }));
    vi.spyOn(window, "confirm").mockReturnValue(true);
    renderModal(saved({ files }));

    fireEvent.click(screen.getByRole("button", { name: "Remove a.pdf" }));

    await waitFor(() => expect(screen.queryByText("a.pdf")).toBeNull());
    expect(remove).toHaveBeenCalledWith("r-1", "f-1");
    expect(screen.getByText("b.pdf")).toBeTruthy();
  });

  it("does not remove a document when the confirmation is declined", () => {
    const remove = vi.spyOn(adminApi, "deleteResourceFile");
    vi.spyOn(window, "confirm").mockReturnValue(false);
    renderModal(saved({ files: [{ id: "f-1", fileName: "a.pdf", mediaType: "application/pdf", sizeBytes: 10 }] }));

    fireEvent.click(screen.getByRole("button", { name: "Remove a.pdf" }));

    expect(remove).not.toHaveBeenCalled();
    expect(screen.getByText("a.pdf")).toBeTruthy();
  });

  it("stops offering uploads once the material holds the maximum number of files", () => {
    const ten = Array.from({ length: 10 }, (_, i) => ({ id: `f-${i}`, fileName: `f${i}.pdf`, mediaType: "application/pdf", sizeBytes: 1 }));
    renderModal(saved({ files: ten }));

    expect(screen.queryByLabelText("Choose documents")).toBeNull();
    expect(screen.getByText(/maximum of 10 files/)).toBeTruthy();
  });
});
