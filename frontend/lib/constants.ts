import type { JobStatus, JobType, JobPriority } from "@/types";

export const APP_NAME = "CronosQ";
export const APP_DESCRIPTION =
  "Reliable distributed job scheduling for emails, webhooks, and reminders.";

// ──────────────────────────────────────────────
// Status config
// ──────────────────────────────────────────────

export const JOB_STATUS_CONFIG: Record<
  JobStatus,
  { label: string; color: string; bg: string }
> = {
  PENDING: {
    label: "Pending",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  QUEUED: { label: "Queued", color: "text-blue-400", bg: "bg-blue-400/10" },
  RUNNING: {
    label: "Running",
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
  },
  PAUSED: { label: "Paused", color: "text-zinc-400", bg: "bg-zinc-400/10" },
  COMPLETED: {
    label: "Completed",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  FAILED: { label: "Failed", color: "text-red-400", bg: "bg-red-400/10" },
  CANCELLED: {
    label: "Cancelled",
    color: "text-zinc-500",
    bg: "bg-zinc-500/10",
  },
};

// ──────────────────────────────────────────────
// Type config
// ──────────────────────────────────────────────

export const JOB_TYPE_CONFIG: Record<
  JobType,
  { label: string; color: string; bg: string; icon: string }
> = {
  EMAIL: {
    label: "Email",
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    icon: "Mail",
  },
  WEBHOOK: {
    label: "Webhook",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    icon: "Webhook",
  },
  REMINDER: {
    label: "Reminder",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    icon: "Bell",
  },
  REPORT: {
    label: "Report",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    icon: "FileText",
  },
  CLEANUP: {
    label: "Cleanup",
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    icon: "Trash2",
  },
};

// ──────────────────────────────────────────────
// Priority config
// ──────────────────────────────────────────────

export const JOB_PRIORITY_CONFIG: Record<
  JobPriority,
  { label: string; color: string; bg: string }
> = {
  LOW: { label: "Low", color: "text-zinc-400", bg: "bg-zinc-400/10" },
  NORMAL: { label: "Normal", color: "text-blue-400", bg: "bg-blue-400/10" },
  HIGH: { label: "High", color: "text-orange-400", bg: "bg-orange-400/10" },
  CRITICAL: { label: "Critical", color: "text-red-400", bg: "bg-red-400/10" },
};

// ──────────────────────────────────────────────
// Navigation
// ──────────────────────────────────────────────

export const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#architecture", label: "Architecture" },
  { href: "#why-cronosq", label: "Why CronosQ" },
];

export const SIDEBAR_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/dashboard/jobs", label: "Jobs", icon: "Briefcase" },
  {
    href: "/dashboard/notifications",
    label: "Notifications",
    icon: "Bell",
  },
  { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
];

// ──────────────────────────────────────────────
// Pagination
// ──────────────────────────────────────────────

export const JOBS_PER_PAGE = 10;
