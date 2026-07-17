"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUnreadCount } from "@/hooks/useNotifications";
import { getSocket } from "@/lib/socket";
import type { JobSocketEvent } from "@/types";

interface LivePopup {
  id: string;
  title: string;
  message: string;
  status: "COMPLETED" | "FAILED";
}

export function NotificationBell() {
  const unreadCount = useUnreadCount();
  const [popups, setPopups] = useState<LivePopup[]>([]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleJobEvent = (event: JobSocketEvent) => {
      if (
        event.event === "JOB_COMPLETED_NOTIFICATION" ||
        event.event === "JOB_FAILED_NOTIFICATION"
      ) {
        const isSuccess = event.event === "JOB_COMPLETED_NOTIFICATION";
        const newPopup: LivePopup = {
          id: Math.random().toString(36).substring(7),
          title: isSuccess ? "Notification Sent" : "Notification Failed",
          message: event.name || event.jobName || event.type,
          status: isSuccess ? "COMPLETED" : "FAILED",
        };

        setPopups((prev) => [...prev, newPopup]);

        setTimeout(() => {
          setPopups((prev) => prev.filter((p) => p.id !== newPopup.id));
        }, 5000);
      }
    };

    socket.on("job:update", handleJobEvent);
    return () => {
      socket.off("job:update", handleJobEvent);
    };
  }, []);

  return (
    <div className="relative">
      <Link
        href="/dashboard/notifications"
        className={cn(
          "relative p-2 rounded-lg transition-colors flex items-center justify-center",
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

      {/* Floating Popups */}
      <div className="absolute top-full right-0 mt-3 w-72 z-50 flex flex-col gap-2 pointer-events-none">
        {popups.map((popup) => (
          <div
            key={popup.id}
            className="pointer-events-auto bg-zinc-900 border border-zinc-800 rounded-xl p-3 shadow-2xl flex items-start gap-3 animate-in slide-in-from-top-4 fade-in duration-300"
          >
            {popup.status === "COMPLETED" ? (
              <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
            ) : (
              <XCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
            )}
            <div>
              <h4 className="text-sm font-semibold text-zinc-100">{popup.title}</h4>
              <p className="text-xs text-zinc-400 mt-0.5">{popup.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
