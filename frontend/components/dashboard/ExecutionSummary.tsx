import { cn } from "@/lib/utils";
import { JOB_STATUS_CONFIG } from "@/lib/constants";
import type { Job, JobStatus } from "@/types";

interface ExecutionSummaryProps {
  jobs: Job[];
}

const TRACKED_STATUSES: JobStatus[] = [
  "PENDING",
  "QUEUED",
  "RUNNING",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
];

export function ExecutionSummary({ jobs }: ExecutionSummaryProps) {
  const counts = TRACKED_STATUSES.reduce(
    (acc, s) => {
      acc[s] = jobs.filter((j) => j.status === s).length;
      return acc;
    },
    {} as Record<JobStatus, number>
  );

  const total = jobs.length;

  return (
    <div className="card p-5">
      <h2 className="text-sm font-semibold text-zinc-200 mb-4">
        Execution Summary
      </h2>

      <div className="flex flex-col gap-3">
        {TRACKED_STATUSES.map((status) => {
          const count = counts[status] ?? 0;
          const pct = total > 0 ? (count / total) * 100 : 0;
          const config = JOB_STATUS_CONFIG[status];

          return (
            <div key={status} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">{config.label}</span>
                <span className="text-xs font-medium text-zinc-300">
                  {count}
                  <span className="text-zinc-600 ml-1">
                    ({pct.toFixed(0)}%)
                  </span>
                </span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    config.color.replace("text-", "bg-")
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
