import { cn } from "@/lib/utils";
import {
  CheckCircle,
  XCircle,
  Play,
  RefreshCw,
  Clock,
} from "lucide-react";
import type { Job } from "@/types";

function formatDateTime(date: string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleString();
}

interface JobTimelineProps {
  job: Job;
}

interface TimelineEvent {
  label: string;
  time: string | null | undefined;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  done: boolean;
}

export function JobTimeline({ job }: JobTimelineProps) {
  const events: TimelineEvent[] = [
    {
      label: "Created",
      time: job.createdAt,
      icon: Clock,
      iconColor: "text-zinc-400",
      iconBg: "bg-zinc-800",
      done: true,
    },
    {
      label: "Queued",
      time: job.status !== "PENDING" ? job.updatedAt : null,
      icon: Play,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-400/10",
      done: ["QUEUED", "RUNNING", "COMPLETED", "FAILED"].includes(job.status),
    },
    {
      label: "Running",
      time: job.lastRunAt,
      icon: RefreshCw,
      iconColor: "text-indigo-400",
      iconBg: "bg-indigo-400/10",
      done: ["RUNNING", "COMPLETED", "FAILED"].includes(job.status),
    },
    {
      label:
        job.status === "FAILED"
          ? "Failed"
          : job.status === "COMPLETED"
            ? "Completed"
            : "Pending completion",
      time: job.status === "COMPLETED" || job.status === "FAILED" ? job.updatedAt : null,
      icon: job.status === "FAILED" ? XCircle : CheckCircle,
      iconColor:
        job.status === "FAILED" ? "text-red-400" : "text-green-400",
      iconBg:
        job.status === "FAILED" ? "bg-red-400/10" : "bg-green-400/10",
      done:
        job.status === "COMPLETED" || job.status === "FAILED",
    },
  ];

  return (
    <div className="flex flex-col gap-0">
      {events.map((event, i) => (
        <div key={i} className="flex gap-4">
          {/* Icon + connector */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border",
                event.done
                  ? `${event.iconBg} border-transparent`
                  : "bg-zinc-900 border-zinc-800"
              )}
            >
              <event.icon
                size={14}
                className={event.done ? event.iconColor : "text-zinc-700"}
              />
            </div>
            {i < events.length - 1 && (
              <div
                className={cn(
                  "w-px flex-1 my-1",
                  event.done ? "bg-zinc-700" : "bg-zinc-800"
                )}
                style={{ minHeight: 20 }}
              />
            )}
          </div>

          {/* Content */}
          <div className="pb-5 flex flex-col gap-0.5">
            <p
              className={cn(
                "text-sm font-medium",
                event.done ? "text-zinc-200" : "text-zinc-600"
              )}
            >
              {event.label}
            </p>
            {event.time && (
              <p className="text-xs text-zinc-500">{formatDateTime(event.time)}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
