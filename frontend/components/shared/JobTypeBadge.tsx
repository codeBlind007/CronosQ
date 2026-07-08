import { cn } from "@/lib/utils";
import { JOB_TYPE_CONFIG } from "@/lib/constants";
import type { JobType } from "@/types";

interface JobTypeBadgeProps {
  type: JobType;
  className?: string;
  showIcon?: boolean;
}

export function JobTypeBadge({
  type,
  className,
  showIcon = false,
}: JobTypeBadgeProps) {
  const config = JOB_TYPE_CONFIG[type];
  if (!config) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
        config.color,
        config.bg,
        className
      )}
    >
      {config.label}
    </span>
  );
}
