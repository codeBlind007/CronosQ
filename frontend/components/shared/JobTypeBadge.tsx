import { cn } from "@/lib/utils";
import { JOB_TYPE_CONFIG } from "@/lib/constants";
import type { JobType } from "@/types";

interface JobTypeBadgeProps {
  type: JobType;
  className?: string;
}

export function JobTypeBadge({ type, className }: JobTypeBadgeProps) {
  const config = JOB_TYPE_CONFIG[type];
  if (!config) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border",
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
