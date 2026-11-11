import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import FilePicker from "../components/files/FilePicker";

function Harness({ initial = [] as File[] }) {
  const [files, setFiles] = useState<File[]>(initial);
  return <FilePicker files={files} onChange={setFiles} />;
}

function chooser(): HTMLInputElement {
  return screen.getByLabelText("Attach files") as HTMLInputElement;
}

describe("FilePicker", () => {
  afterEach(cleanup);

  it("lists chosen files and lets the user remove one", () => {
    render(<Harness />);
    fireEvent.change(chooser(), { target: { files: [new File(["x"], "a.pdf"), new File(["y"], "b.docx")] } });

    expect(screen.getByText("a.pdf")).toBeTruthy();
    expect(screen.getByText("b.docx")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Remove a.pdf" }));
    expect(screen.queryByText("a.pdf")).toBeNull();
    expect(screen.getByText("b.docx")).toBeTruthy();
  });

  it("announces rejected files and still keeps the valid ones", () => {
    render(<Harness />);
    fireEvent.change(chooser(), { target: { files: [new File(["x"], "ok.pdf"), new File(["y"], "virus.exe")] } });

    expect(screen.getByText("ok.pdf")).toBeTruthy();
    expect(screen.getByRole("alert").textContent).toContain('"virus.exe" is not an allowed file type.');
  });

  it("adds dropped files", () => {
    const { container } = render(<Harness />);
    const zone = container.querySelector(".file-picker-zone")!;

    fireEvent.drop(zone, { dataTransfer: { files: [new File(["x"], "dropped.txt")] } });

    expect(screen.getByText("dropped.txt")).toBeTruthy();
  });

  it("disables the chooser once the file limit is reached", () => {
    const five = Array.from({ length: 5 }, (_, i) => new File(["x"], `f${i}.pdf`));
    render(<Harness initial={five} />);

    expect(chooser().disabled).toBe(true);
  });
});
