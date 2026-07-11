import Link from "next/link";
import type { ElementType } from "react";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Bell,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notification, NotificationEventType } from "@/types";

function formatRelativeDate(date: string | Date) {
  const input = new Date(date);
  const diffMs = input.getTime() - Date.now();
  const absMinutes = Math.abs(Math.round(diffMs / 60000));
  const absHours = Math.abs(Math.round(diffMs / 3600000));
  const absDays = Math.abs(Math.round(diffMs / 86400000));

  if (absMinutes < 60) {
    if (absMinutes === 0) return "just now";
    return diffMs > 0
      ? `in ${absMinutes} minute${absMinutes === 1 ? "" : "s"}`
      : `${absMinutes} minute${absMinutes === 1 ? "" : "s"} ago`;
  }

  if (absHours < 24) {
    return diffMs > 0
      ? `in ${absHours} hour${absHours === 1 ? "" : "s"}`
      : `${absHours} hour${absHours === 1 ? "" : "s"} ago`;
  }

  return diffMs > 0
    ? `in ${absDays} day${absDays === 1 ? "" : "s"}`
    : `${absDays} day${absDays === 1 ? "" : "s"} ago`;
}

const TYPE_CONFIG: Record<
  NotificationEventType,
  { icon: ElementType; color: string; bg: string }
> = {
  JOB_COMPLETED: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10" },
  JOB_FAILED: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10" },
  JOB_RETRYING: { icon: RefreshCw, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  REMINDER: { icon: Bell, color: "text-indigo-400", bg: "bg-indigo-400/10" },
  SYSTEM: { icon: AlertCircle, color: "text-zinc-400", bg: "bg-zinc-400/10" },
};

interface NotificationCardProps {
  notification: Notification;
  compact?: boolean;
}

export function NotificationCard({
  notification,
  compact = false,
}: NotificationCardProps) {
  const config = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.SYSTEM;
  const Icon = config.icon;

  return (
    <Link
      href={`/dashboard/notifications/${notification.id}`}
      className={cn(
        "flex gap-3 transition-colors",
        compact ? "px-4 py-3" : "p-4",
        !notification.isRead
          ? "bg-indigo-500/5 border-l-2 border-indigo-500"
          : "border-l-2 border-transparent",
        "hover:bg-zinc-800/40"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          config.bg
        )}
      >
        <Icon size={14} className={config.color} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm leading-snug truncate",
              notification.isRead ? "text-zinc-400" : "text-zinc-100 font-medium"
            )}
          >
            {notification.title}
          </p>
          {!notification.isRead && (
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5" />
          )}
        </div>

        {!compact && (
          <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
            {notification.message}
          </p>
        )}

        <p className="text-xs text-zinc-600 mt-1">
          {formatRelativeDate(notification.createdAt)}
        </p>
      </div>
    </Link>
  );
}
