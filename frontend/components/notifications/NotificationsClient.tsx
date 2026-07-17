"use client";

import { useNotifications, useNotificationById } from "@/hooks/useNotifications";
import { useJobSocket } from "@/hooks/useJobSocket";
import { NotificationCard } from "@/components/notifications/NotificationCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { NotificationSkeleton } from "@/components/shared/LoadingSkeleton";
import { Bell } from "lucide-react";
import { useState } from "react";
import type { Notification } from "@/types";

interface NotificationsClientProps {
  initialNotifications: Notification[];
}

export function NotificationsClient({
  initialNotifications,
}: NotificationsClientProps) {
  // Activate socket listener to catch new notifications in real time
  useJobSocket();

  const {
    data: notificationsData,
    isLoading,
    error,
  } = useNotifications();

  const notifications = notificationsData?.data ?? initialNotifications ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Hook will fetch and mark as read when selectedId is set
  useNotificationById(selectedId ?? "");

  const handleMarkAsRead = (id: string) => {
    setSelectedId(id);
  };

  if (isLoading && !initialNotifications.length) {
    return (
      <div className="card divide-y divide-zinc-800/60">
        {Array.from({ length: 5 }).map((_, i) => (
          <NotificationSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error && !notifications.length) {
    return (
      <div className="card">
        <EmptyState
          title="Failed to load notifications"
          description={error instanceof Error ? error.message : "Error"}
        />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="card">
        <EmptyState
          icon={Bell}
          title="All caught up!"
          description="Your notifications will appear here in real time."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header bar showing unread stats */}
      <div className="flex items-center justify-between text-sm text-zinc-500 px-2">
        <span>
          Showing {notifications.length} notification
          {notifications.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Notifications list */}
      <div className="card overflow-hidden divide-y divide-zinc-800/40">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleMarkAsRead(notification.id)}
            className="cursor-pointer"
          >
            <NotificationCard notification={notification} />
          </div>
        ))}
      </div>
    </div>
  );
}
