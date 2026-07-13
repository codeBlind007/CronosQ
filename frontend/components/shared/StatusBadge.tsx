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
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border transition-colors duration-150",
        config.color,
        config.bg,
        config.border,
        className
      )}
    >
      {config.label}
    </span>
  );
}
