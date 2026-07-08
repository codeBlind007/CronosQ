import { cn } from "@/lib/utils";
import { JOB_STATUS_CONFIG } from "@/lib/constants";
import type { JobStatus } from "@/types";

interface StatusBadgeProps {
  status: JobStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = JOB_STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        config.color,
        config.bg,
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          status === "RUNNING" ? "animate-pulse" : "",
          config.color.replace("text-", "bg-")
        )}
      />
      {config.label}
    </span>
  );
}
