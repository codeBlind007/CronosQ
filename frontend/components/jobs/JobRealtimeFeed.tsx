"use client";

import { ArrowDownRight, BellRing, Clock3, Radar } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { JobTypeBadge } from "@/components/shared/JobTypeBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn } from "@/lib/utils";
import type { LiveJobSocketEvent } from "@/hooks/useJobSocket";

interface JobRealtimeFeedProps {
  events: LiveJobSocketEvent[];
}

function formatRelativeTime(timestamp: string) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  const diffMs = Date.now() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffSeconds < 15) return "Just now";
  if (diffMinutes < 1) return `${diffSeconds}s ago`;
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleString();
}

export function JobRealtimeFeed({ events }: JobRealtimeFeedProps) {
  return (
    <div className="card overflow-hidden h-full">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-zinc-800/60">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-zinc-500">
            <Radar size={12} className="text-indigo-400" />
            Live
          </div>
          <h2 className="mt-1 text-sm font-semibold text-zinc-200">
            Realtime job updates
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Connected
        </div>
      </div>

      {events.length === 0 ? (
        <EmptyState
          icon={BellRing}
          title="Waiting for job activity"
          description="Start or complete a job and the latest realtime events will appear here instantly."
          className="py-14"
        />
      ) : (
        <div className="divide-y divide-zinc-800/40">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-300">
                    <ArrowDownRight size={12} className="text-indigo-400" />
                    {event.label}
                  </span>
                  <JobTypeBadge type={event.type} />
                  <StatusBadge status={event.status} />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-zinc-100 truncate">
                    {event.jobName}
                  </p>
                </div>

                {event.message && (
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {event.message}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                  {event.attemptsMade !== undefined && (
                    <span>Attempts: {event.attemptsMade}</span>
                  )}
                  {event.responseStatus && (
                    <span>Response: {event.responseStatus}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-500 sm:shrink-0">
                <Clock3 size={12} />
                <span className={cn("whitespace-nowrap")}>
                  {formatRelativeTime(event.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
