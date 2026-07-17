import Link from "next/link";
import type { ElementType } from "react";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Bell,
  AlertCircle,
  Mail,
  Webhook,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";
import { Bell as BellIcon, ArrowRight } from "lucide-react";
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
  { icon: ElementType; dotColor: string; iconColor: string }
> = {
  JOB_COMPLETED: {
    icon: CheckCircle,
    dotColor: "bg-[#22C55E]",
    iconColor: "text-[#22C55E]",
  },
  JOB_FAILED: {
    icon: XCircle,
    dotColor: "bg-[#EF4444]",
    iconColor: "text-[#EF4444]",
  },
  JOB_RETRYING: {
    icon: RefreshCw,
    dotColor: "bg-[#F59E0B]",
    iconColor: "text-[#F59E0B]",
  },
  REMINDER: {
    icon: Bell,
    dotColor: "bg-[#6366F1]",
    iconColor: "text-[#6366F1]",
  },
  SYSTEM: {
    icon: AlertCircle,
    dotColor: "bg-[#71717A]",
    iconColor: "text-[#71717A]",
  },
};

function getIconForNotification(notification: Notification): ElementType {
  const title = notification.title.toLowerCase();
  if (title.includes("email")) return Mail;
  if (title.includes("webhook")) return Webhook;
  if (title.includes("reminder")) return Bell;
  return TYPE_CONFIG[notification.type]?.icon ?? AlertCircle;
}

interface ActivityTimelineProps {
  notifications: Notification[];
}

export function ActivityTimeline({ notifications }: ActivityTimelineProps) {
  const items = notifications.slice(0, 8);

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
        <h2 className="section-title">Recent Activity</h2>
        <Link
          href="/dashboard/notifications"
          className="flex items-center gap-1 text-sm text-[#71717A] hover:text-[#6366F1] transition-colors duration-150"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={BellIcon}
          title="No activity yet"
          description="Job events and notifications will appear here."
        />
      ) : (
        <div className="px-6 py-5">
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-2.75 top-2 bottom-2 w-px bg-white/8" />

            <div className="flex flex-col gap-0">
              {items.map((notification) => {
                const config =
                  TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.SYSTEM;
                const Icon = getIconForNotification(notification);

                return (
                  <Link
                    key={notification.id}
                    href={`/dashboard/notifications/${notification.id}`}
                    className="relative flex gap-4 pb-6 last:pb-0 group"
                  >
                    {/* Timeline dot */}
                    <div className="relative z-10 shrink-0">
                      <div
                        className={cn(
                          "size-2.5 rounded-full border-2 border-[#111318] mt-1.5",
                          config.dotColor
                        )}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex gap-3 flex-1 min-w-0 pt-0">
                      <Icon
                        size={16}
                        className={cn("shrink-0 mt-0.5", config.iconColor)}
                      />
                      <div className="flex-1 min-w-0">
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
                        <p className="text-xs text-[#71717A] mt-1">
                          {formatRelativeDate(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <span className="shrink-0 size-1.5 rounded-full bg-[#6366F1] mt-2" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
