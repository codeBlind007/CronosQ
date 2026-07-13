"use client";

import { useMemo } from "react";
import { useJobs, useJobStats } from "@/hooks/useJobs";
import { useNotifications } from "@/hooks/useNotifications";
import { useJobSocket } from "@/hooks/useJobSocket";
import { StatCard } from "@/components/shared/StatCard";
import { RecentJobs } from "@/components/dashboard/RecentJobs";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { ExecutionSummary } from "@/components/dashboard/ExecutionSummary";
import type { DashboardStats, Job, Notification } from "@/types";

interface DashboardClientProps {
  initialJobs: Job[];
  initialNotifications: Notification[];
  initialStats: DashboardStats;
}

function computeSparkline(jobs: Job[]): number[] {
  const days = 7;
  const counts = Array(days).fill(0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  for (const job of jobs) {
    const created = new Date(job.createdAt);
    created.setHours(0, 0, 0, 0);
    const diffDays = Math.floor(
      (now.getTime() - created.getTime()) / 86400000
    );
    if (diffDays >= 0 && diffDays < days) {
      counts[days - 1 - diffDays]++;
    }
  }

  return counts;
}

function computeTrend(jobs: Job[]): { trend: "up" | "down" | "neutral"; value: string } {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  let currentMonth = 0;
  let lastMonth = 0;

  for (const job of jobs) {
    const d = new Date(job.createdAt);
    if (d.getFullYear() === thisYear && d.getMonth() === thisMonth) {
      currentMonth++;
    } else if (
      d.getFullYear() === thisYear &&
      d.getMonth() === thisMonth - 1
    ) {
      lastMonth++;
    } else if (thisMonth === 0 && d.getFullYear() === thisYear - 1 && d.getMonth() === 11) {
      lastMonth++;
    }
  }

  if (lastMonth === 0) {
    return currentMonth > 0
      ? { trend: "up", value: "New this month" }
      : { trend: "neutral", value: "No change" };
  }

  const pct = Math.round(((currentMonth - lastMonth) / lastMonth) * 100);
  if (pct > 0) return { trend: "up", value: `${pct}% this month` };
  if (pct < 0) return { trend: "down", value: `${Math.abs(pct)}% this month` };
  return { trend: "neutral", value: "No change" };
}

export function DashboardClient({
  initialJobs,
  initialNotifications,
  initialStats,
}: DashboardClientProps) {
  useJobSocket();

  const { data: jobsData } = useJobs({ limit: 100 });
  const { data: notificationsData } = useNotifications();
  const { data: statsData } = useJobStats();

  const jobs = jobsData?.data ?? initialJobs ?? [];
  const notifications = notificationsData?.data ?? initialNotifications ?? [];
  const stats = statsData?.data ?? initialStats;

  const sparkline = useMemo(() => computeSparkline(jobs), [jobs]);
  const trendInfo = useMemo(() => computeTrend(jobs), [jobs]);

  return (
    <div className="flex flex-col gap-8">
      {/* Stats Grid — asymmetric layout */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          label="Total Jobs"
          value={stats.totalJobs}
          trend={trendInfo.trend}
          trendValue={trendInfo.value}
          sparkline={sparkline}
          variant="featured"
          className="col-span-2"
        />
        <StatCard label="Completed" value={stats.completedJobs} />
        <StatCard label="Failed" value={stats.failedJobs} />
        <StatCard label="Pending" value={stats.pendingJobs} />
        <StatCard label="Cancelled" value={stats.cancelledJobs} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <RecentJobs jobs={jobs} />
          <ExecutionSummary jobs={jobs} />
        </div>
        <div>
          <ActivityTimeline notifications={notifications} />
        </div>
      </div>
    </div>
  );
}
