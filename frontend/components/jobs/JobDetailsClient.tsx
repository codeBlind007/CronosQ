"use client";

import Link from "next/link";
import { useJobById } from "@/hooks/useJobs";
import { useJobSocket } from "@/hooks/useJobSocket";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { JobTypeBadge } from "@/components/shared/JobTypeBadge";
import { JobTimeline } from "@/components/jobs/JobTimeline";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/LoadingSkeleton";
import { ArrowLeft, Skull } from "lucide-react";
import type { Job } from "@/types";

function formatDateTime(value: string | Date) {
  return new Date(value).toLocaleString();
}

interface JobDetailsClientProps {
  jobId: string;
  initialJob: Job;
}

export function JobDetailsClient({ jobId, initialJob }: JobDetailsClientProps) {
  // Listen for socket events to update job and executions cache
  useJobSocket();

  const { data: job, isLoading, error } = useJobById(jobId);

  // Fallback to initial data fetched server-side
  const currentJob = job ?? initialJob;

  if (isLoading && !currentJob) {
    return <JobDetailsSkeleton />;
  }

  if (error && !currentJob) {
    return (
      <EmptyState
        title="Failed to load job details"
        description={error instanceof Error ? error.message : "Error"}
      />
    );
  }

  if (!currentJob) {
    return <EmptyState title="Job not found" />;
  }

  const executions = currentJob.executions ?? [];

  return (
    <div className="flex flex-col gap-6 fade-in">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Jobs
        </Link>
      </div>

      {/* Header card */}
      <div className="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg font-bold text-zinc-100">{currentJob.name}</h1>
            {currentJob.deadLettered && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-400/10 text-red-400">
                <Skull size={11} />
                Dead Letter
              </span>
            )}
          </div>
          {currentJob.description && (
            <p className="text-xs text-zinc-500">{currentJob.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <JobTypeBadge type={currentJob.type} />
          <StatusBadge status={currentJob.status} />
          <PriorityBadge priority={currentJob.priority} />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Middle Columns */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Job Timeline */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-zinc-200 mb-6">
              Lifecycle Progress
            </h2>
            <div className="pl-2">
              <JobTimeline job={currentJob} />
            </div>
          </div>

          {/* Execution History */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-800/60">
              <h2 className="text-sm font-semibold text-zinc-200">
                Execution History
              </h2>
            </div>

            {executions.length === 0 ? (
              <div className="py-12 text-center text-xs text-zinc-600">
                No executions recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800/60 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      <th className="px-5 py-3">Attempt</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Time</th>
                      <th className="px-5 py-3">Duration</th>
                      <th className="px-5 py-3">Error</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40 text-xs text-zinc-400">
                    {executions.map((exe, index) => (
                      <tr key={exe.id} className="hover:bg-zinc-800/10">
                        <td className="px-5 py-3 font-semibold">
                          #{index + 1}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full font-medium ${
                            exe.status === "COMPLETED"
                              ? "bg-green-400/10 text-green-400"
                              : exe.status === "FAILED"
                                ? "bg-red-400/10 text-red-400"
                                : "bg-indigo-400/10 text-indigo-400"
                          }`}>
                            {exe.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          {exe.startedAt ? formatDateTime(exe.startedAt) : "—"}
                        </td>
                        <td className="px-5 py-3">
                          {exe.durationMs ? `${exe.durationMs}ms` : "—"}
                        </td>
                        <td className="px-5 py-3 text-red-400/80 max-w-50 truncate" title={exe.errorMessage ?? ""}>
                          {exe.errorMessage ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Configuration Card */}
          <div className="card p-5 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-zinc-200">
              Job Configurations
            </h2>

            <div className="flex flex-col gap-3 text-xs text-zinc-400">
              <div className="flex justify-between border-b border-zinc-800/40 pb-2">
                <span>Created At</span>
                <span className="text-zinc-300 font-medium">
                  {formatDateTime(currentJob.createdAt)}
                </span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/40 pb-2">
                <span>Last Executed</span>
                <span className="text-zinc-300 font-medium">
                  {currentJob.lastRunAt ? formatDateTime(currentJob.lastRunAt) : "Never"}
                </span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/40 pb-2">
                <span>Next Scheduled Run</span>
                <span className="text-zinc-300 font-medium">
                  {currentJob.nextRunAt ? formatDateTime(currentJob.nextRunAt) : "Immediate / Manual"}
                </span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/40 pb-2">
                <span>Retries Limit</span>
                <span className="text-zinc-300 font-medium">
                  {currentJob.maxRetries} (attempts left: {Math.max(0, currentJob.maxRetries - executions.length)})
                </span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/40 pb-2">
                <span>Retry Backoff Delay</span>
                <span className="text-zinc-300 font-medium">
                  {currentJob.retryDelaySeconds}s
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cron Pattern</span>
                <span className="text-zinc-300 font-mono">
                  {currentJob.cronExpression ?? "Non-recurring"}
                </span>
              </div>
            </div>
          </div>

          {/* Payload JSON view */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-zinc-200">
                Payload Parameters
              </h2>
            </div>
            <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 text-xs font-mono text-indigo-300 overflow-x-auto max-h-75">
              {JSON.stringify(currentJob.payload ?? {}, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-4 w-28" />
      <div className="card p-6 flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-3 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="flex flex-col gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}
