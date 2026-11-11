import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { learningApi } from "../../../services/api/learningApi";
import type { LearnerResourceDto } from "../../../types/learning";
import { EmptyState, ErrorAlert } from "../../../components/portal/Portal";
import FileList from "../../../components/files/FileList";
import { formatDate } from "../../../utils/format";
import { courseQueryKey } from "./queryKeys";

export default function MaterialsTab({ courseOfferingId, resources }: { courseOfferingId: string; resources: LearnerResourceDto[] }) {
  const queryClient = useQueryClient();
  const complete = useMutation({
    mutationFn: (resourceId: string) => learningApi.completeResource(resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseQueryKey(courseOfferingId) });
      queryClient.invalidateQueries({ queryKey: ["myLearning"] });
    },
  });

  if (resources.length === 0) {
    return <EmptyState title="No learning materials yet" />;
  }

  return (
    <div>
      <ErrorAlert error={complete.error} />
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }} className="portal-stack">
        {resources.map((r) => (
          <li key={r.id} className="portal-card">
            <div className="portal-row-between">
              <div>
                <h3 className="portal-card-title">
                  {r.sequence}. {r.title}
                </h3>
                <div className="portal-card-meta">
                  <span>{r.required ? "Required" : "Optional"}</span>
                  {r.completedAt && <span>Completed {formatDate(r.completedAt)}</span>}
                </div>
              </div>
              <div className="portal-row">
                {r.url && (
                  <a href={r.url} target="_blank" rel="noreferrer" className="portal-btn portal-btn-secondary portal-btn-sm">
                    <ExternalLink size={14} aria-hidden="true" /> Open
                  </a>
                )}
                {r.completedAt ? (
                  <span className="portal-badge portal-badge-success">
                    <CheckCircle2 size={14} aria-hidden="true" style={{ marginRight: 4 }} /> Done
                  </span>
                ) : (
                  <button
                    type="button"
                    className="portal-btn portal-btn-sm"
                    disabled={complete.isPending}
                    onClick={() => complete.mutate(r.id)}
                  >
                    Mark as complete
                  </button>
                )}
              </div>
            </div>
            <FileList files={r.files ?? []} label={`Files for ${r.title}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}
