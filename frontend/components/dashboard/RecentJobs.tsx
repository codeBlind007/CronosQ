import Link from "next/link";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { JobTypeBadge } from "@/components/shared/JobTypeBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Briefcase, ArrowRight } from "lucide-react";
import type { Job } from "@/types";

function formatRelativeDate(dateValue: string | Date) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface RecentJobsProps {
  jobs: Job[];
}

export function RecentJobs({ jobs }: RecentJobsProps) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60">
        <h2 className="text-sm font-semibold text-zinc-200">Recent Jobs</h2>
        <Link
          href="/dashboard/jobs"
          className="flex items-center gap-1 text-xs text-zinc-500 hover:text-indigo-400 transition-colors"
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs yet"
          description="Create your first job to get started."
        />
      ) : (
        <div className="divide-y divide-zinc-800/40">
          {jobs.slice(0, 6).map((job) => (
            <Link
              key={job.id}
              href={`/dashboard/jobs/${job.id}`}
              className="flex items-center justify-between px-5 py-3 hover:bg-zinc-800/20 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <JobTypeBadge type={job.type} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">{job.name}</p>
                  <p className="text-xs text-zinc-500">{formatRelativeDate(job.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <StatusBadge status={job.status} />
                <ArrowRight size={13} className="text-zinc-700 group-hover:text-zinc-500 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
