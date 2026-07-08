import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 px-6 text-center",
        className
      )}
    >
      <div className="p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700/50">
        <Icon size={28} className="text-zinc-500" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-zinc-300">{title}</h3>
        {description && (
          <p className="text-sm text-zinc-500 max-w-xs">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
