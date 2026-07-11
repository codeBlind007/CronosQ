"use client";

import { useJobs, useJobStats } from "@/hooks/useJobs";
import { useNotifications } from "@/hooks/useNotifications";
import { useJobSocket } from "@/hooks/useJobSocket";
import { StatCard } from "@/components/shared/StatCard";
import { RecentJobs } from "@/components/dashboard/RecentJobs";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { ExecutionSummary } from "@/components/dashboard/ExecutionSummary";
import {
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Briefcase,
} from "lucide-react";
import type { DashboardStats, Job, Notification } from "@/types";

interface DashboardClientProps {
  initialJobs: Job[];
  initialNotifications: Notification[];
  initialStats: DashboardStats;
}

export function DashboardClient({
  initialJobs,
  initialNotifications,
  initialStats,
}: DashboardClientProps) {
  // Activate socket listeners for real-time updates and cache invalidation
  useJobSocket();

  // Query jobs (fetch up to 100 to compute dashboard stats)
  const { data: jobsData } = useJobs({ limit: 100 });

  // Query notifications
  const { data: notificationsData } = useNotifications();

  const { data: statsData } = useJobStats();

  // Fallback to initial data if TanStack Query hasn't resolved yet
  const jobs = jobsData?.data ?? initialJobs ?? [];
  const notifications = notificationsData?.data ?? initialNotifications ?? [];
  const stats = statsData?.data ?? initialStats;

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Jobs"
          value={stats.totalJobs}
          icon={Briefcase}
          iconColor="text-indigo-400"
        />
        <StatCard
          label="Completed"
          value={stats.completedJobs}
          icon={CheckCircle2}
          iconColor="text-green-400"
        />
        <StatCard
          label="Failed"
          value={stats.failedJobs}
          icon={AlertTriangle}
          iconColor="text-red-400"
        />
        <StatCard
          label="Cancelled"
          value={stats.cancelledJobs}
          icon={Clock}
          iconColor="text-zinc-400"
        />
        <StatCard
          label="Pending"
          value={stats.pendingJobs}
          icon={Play}
          iconColor="text-blue-400"
        />
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
