"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Skull } from "lucide-react";
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

function getRelativeTimeLabel(date: string | Date) {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDateTime(date);
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
        <EmptyState title="Failed to load jobs" description={error} />
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
            {jobs.map((job) => (
              <JobTableRow key={job.id} job={job} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function JobTableHead() {
  return (
    <tr className="border-b border-white/8">
      {["Name", "Type", "Status", "Priority", "Schedule", "Created", ""].map(
        (h) => (
          <th
            key={h}
            className="px-5 py-3.5 text-left text-xs font-medium text-[#71717A] uppercase tracking-wider whitespace-nowrap"
          >
            {h}
          </th>
        )
      )}
    </tr>
  );
}

function JobTableRow({ job }: { job: Job }) {
  const createdAtLabel = getRelativeTimeLabel(job.createdAt);

  return (
    <tr className="border-b border-white/6 hover:bg-[#171A21]/50 transition-colors duration-150">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          {job.deadLettered && (
            <Skull
              size={12}
              className="text-[#EF4444] shrink-0"
              aria-label="Dead lettered"
            />
          )}
          <div>
            <p className="font-medium text-[#FAFAFA] truncate max-w-45">
              {job.name}
            </p>
            {job.description && (
              <p className="text-xs text-[#71717A] truncate max-w-45 mt-0.5">
                {job.description}
              </p>
            )}
          </div>
        </div>
      </td>

      <td className="px-5 py-3.5">
        <JobTypeBadge type={job.type} />
      </td>

      <td className="px-5 py-3.5">
        <StatusBadge status={job.status} />
      </td>

      <td className="px-5 py-3.5">
        <PriorityBadge priority={job.priority} />
      </td>

      <td className="px-5 py-3.5 text-[#A1A1AA] whitespace-nowrap">
        {job.isRecurring ? (
          <span className="font-mono text-xs text-[#6366F1]">
            {job.cronExpression ?? "Recurring"}
          </span>
        ) : job.scheduledAt ? (
          <span className="text-xs">{formatDateTime(job.scheduledAt)}</span>
        ) : (
          <span className="text-xs text-[#71717A]">Immediate</span>
        )}
      </td>

      <td className="px-5 py-3.5 text-xs text-[#71717A] whitespace-nowrap">
        {createdAtLabel}
      </td>

      <td className="px-5 py-3.5">
        <Link
          href={`/dashboard/jobs/${job.id}`}
          className="inline-flex items-center gap-1 text-xs text-[#71717A] hover:text-[#6366F1] transition-colors duration-150"
          aria-label={`View job ${job.name}`}
        >
          <ExternalLink size={13} />
        </Link>
      </td>
    </tr>
  );
}
