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
  JOB_COMPLETED: {
    icon: CheckCircle,
    color: "text-[#22C55E]",
    bg: "bg-[#22C55E]/10",
  },
  JOB_FAILED: {
    icon: XCircle,
    color: "text-[#EF4444]",
    bg: "bg-[#EF4444]/10",
  },
  JOB_RETRYING: {
    icon: RefreshCw,
    color: "text-[#F59E0B]",
    bg: "bg-[#F59E0B]/10",
  },
  REMINDER: {
    icon: Bell,
    color: "text-[#6366F1]",
    bg: "bg-[#6366F1]/10",
  },
  SYSTEM: {
    icon: AlertCircle,
    color: "text-[#71717A]",
    bg: "bg-white/[0.04]",
  },
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
        "flex gap-4 transition-colors duration-150 hover:bg-[#171A21]",
        compact ? "px-6 py-4" : "p-6",
        !notification.isRead && "bg-[#6366F1]/5"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08]",
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
              notification.isRead
                ? "text-[#A1A1AA]"
                : "text-[#FAFAFA] font-medium"
            )}
          >
            {notification.title}
          </p>
          {!notification.isRead && (
            <span className="flex-shrink-0 size-1.5 rounded-full bg-[#6366F1] mt-1.5" />
          )}
        </div>

        {!compact && (
          <p className="text-sm text-[#71717A] mt-1 line-clamp-2">
            {notification.message}
          </p>
        )}

        <p className="text-xs text-[#71717A] mt-1.5">
          {formatRelativeDate(notification.createdAt)}
        </p>
      </div>
    </Link>
  );
}
