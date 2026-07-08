"use client";

import { useJobs } from "@/hooks/useJobs";
import { useNotifications } from "@/hooks/useNotifications";
import { useJobSocket } from "@/hooks/useJobSocket";
import { StatCard } from "@/components/shared/StatCard";
import { RecentJobs } from "@/components/dashboard/RecentJobs";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { ExecutionSummary } from "@/components/dashboard/ExecutionSummary";
import { StatCardSkeleton, TableRowSkeleton } from "@/components/shared/LoadingSkeleton";
import { Play, CheckCircle2, AlertTriangle, Clock, Briefcase } from "lucide-react";
import type { Job, Notification } from "@/types";

interface DashboardClientProps {
  initialJobs: Job[];
  initialNotifications: Notification[];
}

export function DashboardClient({
  initialJobs,
  initialNotifications,
}: DashboardClientProps) {
  // Activate socket listeners for real-time updates and cache invalidation
  useJobSocket();

  // Query jobs (fetch up to 100 to compute dashboard stats)
  const {
    data: jobsData,
    isLoading: jobsLoading,
    error: jobsError,
  } = useJobs({ limit: 100 } as any);

  // Query notifications
  const {
    data: notificationsData,
    isLoading: notificationsLoading,
    error: notificationsError,
  } = useNotifications();

  // Fallback to initial data if TanStack Query hasn't resolved yet
  const jobs = jobsData?.data ?? initialJobs ?? [];
  const notifications = notificationsData?.data ?? initialNotifications ?? [];

  // Derived stats
  const total = jobs.length;
  const scheduled = jobs.filter((j) => j.status === "QUEUED" || (j.isRecurring && j.status !== "FAILED")).length;
  const running = jobs.filter((j) => j.status === "RUNNING").length;
  const completed = jobs.filter((j) => j.status === "COMPLETED").length;
  const failed = jobs.filter((j) => j.status === "FAILED").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {jobsLoading && !initialJobs.length ? (
          Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total Jobs" value={total} icon={Briefcase} iconColor="text-indigo-400" />
            <StatCard label="Scheduled" value={scheduled} icon={Clock} iconColor="text-blue-400" />
            <StatCard label="Running" value={running} icon={Play} iconColor="text-indigo-400" />
            <StatCard label="Completed" value={completed} icon={CheckCircle2} iconColor="text-green-400" />
            <StatCard label="Failed" value={failed} icon={AlertTriangle} iconColor="text-red-400" />
          </>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Middle Column (Jobs list + Stats summary) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <RecentJobs jobs={jobs} />
          <ExecutionSummary jobs={jobs} />
        </div>

        {/* Right Column (Activity Feed) */}
        <div>
          <ActivityTimeline notifications={notifications} />
        </div>
      </div>
    </div>
  );
}
