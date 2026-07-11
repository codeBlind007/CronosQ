"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSocket } from "@/lib/socket";
import { JOB_KEYS } from "./useJobs";
import { NOTIFICATION_KEYS } from "./useNotifications";
import type {
  JobPriority,
  JobSocketEvent,
  JobStatus,
  JobType,
  NotificationSocketEvent,
} from "@/types";

type JobSocketPayload = JobSocketEvent & {
  name?: string;
  jobName?: string;
  clerkId?: string;
  response?: {
    success?: boolean;
    status?: string;
    notificationId?: string;
  };
};

export interface LiveJobSocketEvent {
  id: string;
  event: JobSocketEvent["event"];
  label: string;
  jobName?: string;
  type: JobType;
  status: JobStatus;
  priority?: JobPriority;
  attemptsMade?: number;
  responseStatus?: string;
  timestamp: string;
  message?: string;
}

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
  const [recentEvents, setRecentEvents] = useState<LiveJobSocketEvent[]>([]);
  const seenEventIds = useRef(new Set<string>());

  const pushRecentEvent = (event: JobSocketPayload) => {
    const eventId = `${event.jobId}-${event.timestamp}-${event.event}`;

    if (seenEventIds.current.has(eventId)) {
      return;
    }

    seenEventIds.current.add(eventId);

    const jobLabel = event.name ?? event.jobName ?? event.jobId;

    setRecentEvents((current) =>
      [
        {
          id: eventId,
          event: event.event,
          label: EVENT_MAP[event.event]?.label ?? event.event,
          jobName: jobLabel,
          type: event.type,
          status: event.status,
          attemptsMade: event.attemptsMade,
          responseStatus: event.response?.status,
          timestamp: event.timestamp,
          message: event.message,
        },
        ...current,
      ].slice(0, 6),
    );
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleJobEvent = (event: JobSocketPayload) => {
      const config = EVENT_MAP[event.event] ?? {
        label: event.event,
        variant: "default" as const,
      };
      const message = event.message ?? `${config.label} · ${event.type}`;

      if (config.variant === "success") toast.success(message);
      else if (config.variant === "error") toast.error(message);
      else if (config.variant === "warning") toast.warning(message);
      else toast.info(message);

      pushRecentEvent(event);

      // Invalidate relevant caches
      queryClient.invalidateQueries({ queryKey: JOB_KEYS.all });
      queryClient.invalidateQueries({ queryKey: JOB_KEYS.stats });
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

    socket.on("job:update", handleJobEvent);
    socket.on("job.started", handleJobEvent);
    socket.on("job.completed", handleJobEvent);
    socket.on("job.failed", handleJobEvent);
    socket.on("job.retry", handleJobEvent);
    socket.on("notification.created", handleNotification);

    return () => {
      socket.off("job:update", handleJobEvent);
      socket.off("job.started", handleJobEvent);
      socket.off("job.completed", handleJobEvent);
      socket.off("job.failed", handleJobEvent);
      socket.off("job.retry", handleJobEvent);
      socket.off("notification.created", handleNotification);
    };
  }, [queryClient]);

  return { recentEvents };
}
