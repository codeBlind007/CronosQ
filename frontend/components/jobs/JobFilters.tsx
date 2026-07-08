"use client";

import { type JobStatus, type JobType } from "@/types";
import { cn } from "@/lib/utils";

const STATUSES: (JobStatus | "")[] = [
  "",
  "PENDING",
  "QUEUED",
  "RUNNING",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
];
const TYPES: (JobType | "")[] = [
  "",
  "EMAIL",
  "WEBHOOK",
  "REMINDER",
  "REPORT",
  "CLEANUP",
];

interface JobFiltersProps {
  status: JobStatus | "";
  type: JobType | "";
  deadLettered: boolean;
  onStatusChange: (s: JobStatus | "") => void;
  onTypeChange: (t: JobType | "") => void;
  onDeadLetteredChange: (v: boolean) => void;
}

export function JobFilters({
  status,
  type,
  deadLettered,
  onStatusChange,
  onTypeChange,
  onDeadLetteredChange,
}: JobFiltersProps) {
  const selectClass = cn(
    "py-2 pl-3 pr-8 text-sm rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300",
    "focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30",
    "appearance-none cursor-pointer transition-colors"
  );

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Status */}
      <div className="relative">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as JobStatus | "")}
          className={selectClass}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {STATUSES.slice(1).map((s) => (
            <option key={s} value={s}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">▾</span>
      </div>

      {/* Type */}
      <div className="relative">
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value as JobType | "")}
          className={selectClass}
          aria-label="Filter by type"
        >
          <option value="">All types</option>
          {TYPES.slice(1).map((t) => (
            <option key={t} value={t}>
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">▾</span>
      </div>

      {/* Dead lettered */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <div
          onClick={() => onDeadLetteredChange(!deadLettered)}
          className={cn(
            "w-8 h-4.5 rounded-full transition-colors relative cursor-pointer",
            deadLettered ? "bg-red-500" : "bg-zinc-700"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform",
              deadLettered ? "translate-x-3.5" : "translate-x-0.5"
            )}
          />
        </div>
        <span className="text-xs text-zinc-400">Dead letter only</span>
      </label>
    </div>
  );
}
