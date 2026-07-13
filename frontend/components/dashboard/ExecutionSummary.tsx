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

const BAR_COLORS: Record<JobStatus, string> = {
  PENDING: "bg-[#F59E0B]",
  QUEUED: "bg-[#6366F1]",
  RUNNING: "bg-[#6366F1]",
  PAUSED: "bg-[#71717A]",
  COMPLETED: "bg-[#22C55E]",
  FAILED: "bg-[#EF4444]",
  CANCELLED: "bg-[#71717A]",
};

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
    <div className="card p-6">
      <h2 className="section-title mb-6">Execution Summary</h2>

      <div className="flex flex-col gap-4">
        {TRACKED_STATUSES.map((status) => {
          const count = counts[status] ?? 0;
          const pct = total > 0 ? (count / total) * 100 : 0;
          const config = JOB_STATUS_CONFIG[status];

          return (
            <div key={status} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#A1A1AA]">{config.label}</span>
                <span className="text-sm font-medium text-[#FAFAFA]">
                  {count}
                  <span className="text-[#71717A] ml-1 font-normal">
                    ({pct.toFixed(0)}%)
                  </span>
                </span>
              </div>
              <div className="h-1.5 bg-[#171A21] rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-150",
                    BAR_COLORS[status]
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
