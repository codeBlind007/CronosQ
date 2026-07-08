import { NotificationCard } from "@/components/notifications/NotificationCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Bell, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Notification } from "@/types";

interface ActivityTimelineProps {
  notifications: Notification[];
}

export function ActivityTimeline({ notifications }: ActivityTimelineProps) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60">
        <h2 className="text-sm font-semibold text-zinc-200">Recent Activity</h2>
        <Link
          href="/dashboard/notifications"
          className="flex items-center gap-1 text-xs text-zinc-500 hover:text-indigo-400 transition-colors"
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No activity yet"
          description="Job events and notifications will appear here."
        />
      ) : (
        <div className="divide-y divide-zinc-800/40">
          {notifications.slice(0, 6).map((n) => (
            <NotificationCard key={n.id} notification={n} compact />
          ))}
        </div>
      )}
    </div>
  );
}
