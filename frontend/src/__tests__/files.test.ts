import { describe, expect, it } from "vitest";
import { MAX_FILES_PER_UPLOAD, MAX_FILE_BYTES, addFiles, formatFileSize } from "../types/files";

function file(name: string, size = 100): File {
  return new File([new Uint8Array(size)], name);
}

describe("addFiles", () => {
  it("accepts allowed types regardless of letter case", () => {
    const result = addFiles([], [file("Report.PDF"), file("notes.txt"), file("a.docx")]);
    expect(result.accepted.map((f) => f.name)).toEqual(["Report.PDF", "notes.txt", "a.docx"]);
    expect(result.errors).toEqual([]);
  });

  it.each(["setup.exe", "page.html", "image.svg", "noextension", "archive.tar.gz"])("rejects %s by name", (name) => {
    const result = addFiles([], [file(name)]);
    expect(result.accepted).toHaveLength(0);
    expect(result.errors[0]).toContain(name);
  });

  it("rejects empty and oversized files", () => {
    const result = addFiles([], [file("empty.pdf", 0), file("big.pdf", MAX_FILE_BYTES + 1)]);
    expect(result.accepted).toHaveLength(0);
    expect(result.errors).toHaveLength(2);
  });

  it("accepts a file of exactly the maximum size", () => {
    expect(addFiles([], [file("exact.pdf", MAX_FILE_BYTES)]).accepted).toHaveLength(1);
  });

  it("skips duplicates of already selected files", () => {
    const first = file("a.pdf");
    const result = addFiles([first], [file("a.pdf")]);
    expect(result.accepted).toEqual([first]);
    expect(result.errors[0]).toContain("already selected");
  });

  it("stops at the file limit and reports the rest", () => {
    const incoming = Array.from({ length: MAX_FILES_PER_UPLOAD + 2 }, (_, i) => file(`f${i}.pdf`));
    const result = addFiles([], incoming);
    expect(result.accepted).toHaveLength(MAX_FILES_PER_UPLOAD);
    expect(result.errors).toHaveLength(2);
  });

  it("keeps valid files when others in the same batch are rejected", () => {
    const result = addFiles([], [file("ok.pdf"), file("bad.exe")]);
    expect(result.accepted.map((f) => f.name)).toEqual(["ok.pdf"]);
    expect(result.errors).toHaveLength(1);
  });
});

describe("formatFileSize", () => {
  it.each([
    [512, "512 B"],
    [2048, "2.0 KB"],
    [200 * 1024, "200 KB"],
    [5 * 1024 * 1024, "5.0 MB"],
  ])("formats %i bytes as %s", (bytes, text) => {
    expect(formatFileSize(bytes)).toBe(text);
  });
});
