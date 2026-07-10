"use client";

import React from "react";
import Link from "next/link";
import {
  ExternalLink,
  Skull,
} from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { JobTypeBadge } from "@/components/shared/JobTypeBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { Briefcase } from "lucide-react";
import type { Job } from "@/types";

interface JobTableProps {
  jobs: Job[];
  isLoading?: boolean;
  error?: string | null;
  action?: React.ReactNode;
}

function formatDateTime(value: string | Date) {
  return new Date(value).toLocaleString();
}

export function JobTable({
  jobs,
  isLoading,
  error,
  action,
}: JobTableProps) {
  if (isLoading) {
    return (
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <JobTableHead />
          </thead>
          <tbody>
            <TableSkeleton rows={5} cols={7} />
          </tbody>
        </table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <EmptyState
          title="Failed to load jobs"
          description={error}
        />
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="card">
        <EmptyState
          icon={Briefcase}
          title="No jobs found"
          description="Create a job to get started."
          action={action}
        />
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <JobTableHead />
          </thead>
          <tbody>
            {jobs.map((job, i) => (
              <JobTableRow key={job.id} job={job} index={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function JobTableHead() {
  return (
    <tr className="border-b border-zinc-800/60">
      {["Name", "Type", "Status", "Priority", "Schedule", "Created", ""].map(
        (h) => (
          <th
            key={h}
            className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider whitespace-nowrap"
          >
            {h}
          </th>
        )
      )}
    </tr>
  );
}

function JobTableRow({ job, index }: { job: Job; index: number }) {
  const createdAtLabel = (() => {
    const diffMs = Date.now() - new Date(job.createdAt).getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return formatDateTime(job.createdAt);
  })();

  return (
    <tr
      className="border-b border-zinc-800/40 hover:bg-zinc-800/20 transition-colors"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Name */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {job.deadLettered && (
            <Skull size={12} className="text-red-400 shrink-0" aria-label="Dead lettered" />
          )}
          <div>
            <p className="font-medium text-zinc-200 truncate max-w-45">
              {job.name}
            </p>
            {job.description && (
              <p className="text-xs text-zinc-500 truncate max-w-45">
                {job.description}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Type */}
      <td className="px-4 py-3">
        <JobTypeBadge type={job.type} />
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <StatusBadge status={job.status} />
      </td>

      {/* Priority */}
      <td className="px-4 py-3">
        <PriorityBadge priority={job.priority} />
      </td>

      {/* Schedule */}
      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">
        {job.isRecurring ? (
          <span className="font-mono text-xs text-indigo-400">
            {job.cronExpression ?? "Recurring"}
          </span>
        ) : job.scheduledAt ? (
          <span className="text-xs">{formatDateTime(job.scheduledAt)}</span>
        ) : (
          <span className="text-xs text-zinc-600">Immediate</span>
        )}
      </td>

      {/* Created */}
      <td className="px-4 py-3 text-xs text-zinc-500 whitespace-nowrap">
        {createdAtLabel}
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <Link
          href={`/dashboard/jobs/${job.id}`}
          className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-indigo-400 transition-colors"
          aria-label={`View job ${job.name}`}
        >
          <ExternalLink size={13} />
        </Link>
      </td>
    </tr>
  );
}
