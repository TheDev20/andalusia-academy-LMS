import { afterEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import InstructorAssignmentsTab from "../pages/instructor/cohort/AssignmentsTab";
import LearnerAssignmentsTab from "../pages/learner/CourseLearningPage/AssignmentsTab";
import { instructorApi } from "../services/api/instructorApi";
import { learningApi } from "../services/api/learningApi";
import { ApiError } from "../services/api/httpClient";
import type { InstructorAssignmentDto, LearnerAssignmentDto, SubmissionDto } from "../types/learning";

const pdf = { id: "f-1", fileName: "questions.pdf", mediaType: "application/pdf", sizeBytes: 2048 };

function withClient(ui: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

const instructorAssignment = (over: Partial<InstructorAssignmentDto> = {}): InstructorAssignmentDto => ({
  id: "a-1", title: "Homework 1", instructions: "Do it", maxScore: 50, dueAt: null, status: "Published",
  submissionCount: 0, ungradedCount: 0, files: [], ...over,
});

describe("instructor assignment editor", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  function openNew() {
    withClient(<InstructorAssignmentsTab offeringId="o-1" assignments={[]} />);
    fireEvent.click(screen.getByRole("button", { name: /new assignment/i }));
  }

  it("creates the assignment, uploads the attached files and closes", async () => {
    const create = vi.spyOn(instructorApi, "createAssignment").mockResolvedValue(instructorAssignment());
    const upload = vi.spyOn(instructorApi, "uploadAssignmentFiles").mockResolvedValue(instructorAssignment());
    openNew();

    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Homework 1" } });
    fireEvent.change(screen.getByLabelText("Instructions"), { target: { value: "Do it" } });
    fireEvent.change(screen.getByLabelText("Attach files"), { target: { files: [new File(["%PDF-1.4"], "questions.pdf")] } });
    fireEvent.click(screen.getByRole("button", { name: "Create assignment" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(create).toHaveBeenCalledOnce();
    expect(upload).toHaveBeenCalledWith("a-1", [expect.objectContaining({ name: "questions.pdf" })]);
  });

  it("does not create a second assignment when a failed upload is retried", async () => {
    const create = vi.spyOn(instructorApi, "createAssignment").mockResolvedValue(instructorAssignment());
    const update = vi.spyOn(instructorApi, "updateAssignment").mockResolvedValue(instructorAssignment());
    const upload = vi
      .spyOn(instructorApi, "uploadAssignmentFiles")
      .mockRejectedValueOnce(new ApiError(422, "This file type is not allowed."))
      .mockResolvedValueOnce(instructorAssignment());
    openNew();

    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Homework 1" } });
    fireEvent.change(screen.getByLabelText("Instructions"), { target: { value: "Do it" } });
    fireEvent.change(screen.getByLabelText("Attach files"), { target: { files: [new File(["x"], "questions.pdf")] } });
    fireEvent.click(screen.getByRole("button", { name: "Create assignment" }));

    expect((await screen.findByRole("alert")).textContent).toContain("not allowed");
    expect(screen.getByRole("dialog")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Create assignment" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(create).toHaveBeenCalledOnce();
    expect(update).toHaveBeenCalledWith("a-1", expect.objectContaining({ title: "Homework 1" }));
    expect(upload).toHaveBeenCalledTimes(2);
  });

  it("shows existing attachments of an assignment and removes one after confirmation", async () => {
    const remove = vi.spyOn(instructorApi, "deleteAssignmentFile").mockResolvedValue(instructorAssignment({ files: [] }));
    vi.spyOn(window, "confirm").mockReturnValue(true);
    withClient(<InstructorAssignmentsTab offeringId="o-1" assignments={[instructorAssignment({ files: [pdf] })]} />);

    fireEvent.click(screen.getByRole("button", { name: "Edit Homework 1" }));
    expect(screen.getByText("questions.pdf")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Remove questions.pdf" }));

    await waitFor(() => expect(screen.queryByText("questions.pdf")).toBeNull());
    expect(remove).toHaveBeenCalledWith("a-1", "f-1");
  });
});

describe("learner assignment card", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const learnerAssignment = (over: Partial<LearnerAssignmentDto> = {}): LearnerAssignmentDto => ({
    id: "a-1", title: "Homework 1", instructions: "Answer the questions.", maxScore: 50, dueAt: null, status: "Published",
    latestSubmission: null, attachments: [], ...over,
  });

  const submission: SubmissionDto = {
    id: "s-1", assignmentId: "a-1", attemptNumber: 1, body: null, score: null, submittedAt: new Date().toISOString(), gradedAt: null,
    files: [{ id: "f-9", fileName: "my work.pdf", mediaType: "application/pdf", sizeBytes: 10 }],
  };

  it("lists the instructor's attachments for download", () => {
    withClient(<LearnerAssignmentsTab courseOfferingId="o-1" assignments={[learnerAssignment({ attachments: [pdf] })]} />);

    expect(screen.getByRole("button", { name: "Download questions.pdf" })).toBeTruthy();
  });

  it("keeps submit disabled until there is text or a file, then submits a file-only attempt", async () => {
    const submit = vi.spyOn(learningApi, "submitAssignment").mockResolvedValue(submission);
    withClient(<LearnerAssignmentsTab courseOfferingId="o-1" assignments={[learnerAssignment()]} />);
    const button = screen.getByRole("button", { name: "Submit assignment" }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    fireEvent.change(screen.getByLabelText("Attach files"), { target: { files: [new File(["%PDF-1.4"], "my work.pdf")] } });
    expect(button.disabled).toBe(false);
    fireEvent.click(button);

    expect(await screen.findByText("Attempt 1 submitted.")).toBeTruthy();
    expect(submit).toHaveBeenCalledWith("a-1", "", [expect.objectContaining({ name: "my work.pdf" })]);
  });

  it("shows the files of the learner's latest submission", () => {
    withClient(<LearnerAssignmentsTab courseOfferingId="o-1" assignments={[learnerAssignment({ latestSubmission: submission })]} />);

    expect(screen.getByRole("button", { name: "Download my work.pdf" })).toBeTruthy();
    expect(screen.getByText(/awaiting grading/)).toBeTruthy();
  });

  it("still renders the legacy attachment link embedded in older assignment instructions", () => {
    const legacy = "Read this.\n\n📎 Attachment: [old.pdf](/api/uploads/abc_old.pdf)";
    withClient(<LearnerAssignmentsTab courseOfferingId="o-1" assignments={[learnerAssignment({ instructions: legacy })]} />);

    expect(screen.getByText("old.pdf")).toBeTruthy();
    expect(screen.getByText("Read this.")).toBeTruthy();
  });
});
