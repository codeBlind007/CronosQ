import { cn } from "@/lib/utils";
import { JOB_PRIORITY_CONFIG } from "@/lib/constants";
import type { JobPriority } from "@/types";

interface PriorityBadgeProps {
  priority: JobPriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = JOB_PRIORITY_CONFIG[priority];
  if (!config) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        config.color,
        config.bg,
        className
      )}
    >
      {config.label}
    </span>
  );
}
