"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUnreadCount } from "@/hooks/useNotifications";

export function NotificationBell() {
  const unreadCount = useUnreadCount();

  return (
    <Link
      href="/dashboard/notifications"
      className={cn(
        "relative p-2 rounded-lg transition-colors",
        "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
      )}
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
    >
      <Bell size={18} />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-indigo-500 text-white text-[9px] font-bold">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
