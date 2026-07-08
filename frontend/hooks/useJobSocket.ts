"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSocket } from "@/lib/socket";
import { JOB_KEYS } from "./useJobs";
import { NOTIFICATION_KEYS } from "./useNotifications";
import type { JobSocketEvent, NotificationSocketEvent } from "@/types";

const EVENT_MAP: Record<
  JobSocketEvent["event"],
  { label: string; variant: "default" | "success" | "error" | "warning" }
> = {
  JOB_STARTED: { label: "Job started", variant: "default" },
  JOB_COMPLETED: { label: "Job completed", variant: "success" },
  JOB_FAILED: { label: "Job failed", variant: "error" },
  JOB_RETRYING: { label: "Job retrying", variant: "warning" },
  JOB_CANCELLED: { label: "Job cancelled", variant: "warning" },
  JOB_PAUSED: { label: "Job paused", variant: "default" },
  JOB_RESUMED: { label: "Job resumed", variant: "default" },
};

export function useJobSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleJobEvent = (event: JobSocketEvent) => {
      const config = EVENT_MAP[event.event];
      const message = event.message ?? `${config.label} · ${event.type}`;

      if (config.variant === "success") toast.success(message);
      else if (config.variant === "error") toast.error(message);
      else if (config.variant === "warning") toast.warning(message);
      else toast.info(message);

      // Invalidate relevant caches
      queryClient.invalidateQueries({ queryKey: JOB_KEYS.all });
      if (event.jobId) {
        queryClient.invalidateQueries({
          queryKey: JOB_KEYS.detail(event.jobId),
        });
      }
    };

    const handleNotification = (event: NotificationSocketEvent) => {
      toast.info(event.title, { description: event.message });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    };

    socket.on("job.started", handleJobEvent);
    socket.on("job.completed", handleJobEvent);
    socket.on("job.failed", handleJobEvent);
    socket.on("job.retry", handleJobEvent);
    socket.on("notification.created", handleNotification);

    return () => {
      socket.off("job.started", handleJobEvent);
      socket.off("job.completed", handleJobEvent);
      socket.off("job.failed", handleJobEvent);
      socket.off("job.retry", handleJobEvent);
      socket.off("notification.created", handleNotification);
    };
  }, [queryClient]);
}
