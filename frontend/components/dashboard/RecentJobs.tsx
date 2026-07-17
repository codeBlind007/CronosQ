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
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
        <h2 className="section-title">Recent Jobs</h2>
        <Link
          href="/dashboard/jobs"
          className="flex items-center gap-1 text-sm text-[#71717A] hover:text-[#6366F1] transition-colors duration-150"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs yet"
          description="Create your first job to get started."
        />
      ) : (
        <div>
          {jobs.slice(0, 6).map((job) => (
            <Link
              key={job.id}
              href={`/dashboard/jobs/${job.id}`}
              className="flex items-center justify-between px-6 py-4 border-b border-white/6 last:border-b-0 hover:bg-[#171A21] transition-colors duration-150 group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <JobTypeBadge type={job.type} />
                <div className="min-w-0">
                  <p className="text-[15px] font-medium text-[#FAFAFA] truncate">
                    {job.name}
                  </p>
                  <p className="text-sm text-[#71717A] mt-0.5">
                    {formatRelativeDate(job.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={job.status} />
                <ArrowRight
                  size={14}
                  className="text-[#71717A] opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
