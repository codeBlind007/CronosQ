import type { JobStatus, JobType, JobPriority } from "@/types";

export const APP_NAME = "CronosQ";
export const APP_DESCRIPTION =
  "Reliable distributed job scheduling for emails, webhooks, and reminders.";

// ──────────────────────────────────────────────
// Status config
// ──────────────────────────────────────────────

export const JOB_STATUS_CONFIG: Record<
  JobStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  PENDING: {
    label: "Pending",
    color: "text-[#F59E0B]",
    bg: "bg-[#F59E0B]/10",
    border: "border-[#F59E0B]/15",
  },
  QUEUED: {
    label: "Queued",
    color: "text-[#6366F1]",
    bg: "bg-[#6366F1]/10",
    border: "border-[#6366F1]/15",
  },
  RUNNING: {
    label: "Running",
    color: "text-[#6366F1]",
    bg: "bg-[#6366F1]/10",
    border: "border-[#6366F1]/15",
  },
  PAUSED: {
    label: "Paused",
    color: "text-[#A1A1AA]",
    bg: "bg-white/[0.04]",
    border: "border-white/[0.08]",
  },
  COMPLETED: {
    label: "Completed",
    color: "text-[#22C55E]",
    bg: "bg-[#22C55E]/10",
    border: "border-[#22C55E]/15",
  },
  FAILED: {
    label: "Failed",
    color: "text-[#EF4444]",
    bg: "bg-[#EF4444]/10",
    border: "border-[#EF4444]/15",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-[#71717A]",
    bg: "bg-white/[0.04]",
    border: "border-white/[0.08]",
  },
};

// ──────────────────────────────────────────────
// Type config
// ──────────────────────────────────────────────

export const JOB_TYPE_CONFIG: Record<
  JobType,
  { label: string; color: string; bg: string; border: string; icon: string }
> = {
  EMAIL: {
    label: "Email",
    color: "text-[#A1A1AA]",
    bg: "bg-white/[0.04]",
    border: "border-white/[0.08]",
    icon: "Mail",
  },
  WEBHOOK: {
    label: "Webhook",
    color: "text-[#A1A1AA]",
    bg: "bg-white/[0.04]",
    border: "border-white/[0.08]",
    icon: "Webhook",
  },
  REMINDER: {
    label: "Reminder",
    color: "text-[#A1A1AA]",
    bg: "bg-white/[0.04]",
    border: "border-white/[0.08]",
    icon: "Bell",
  },
  REPORT: {
    label: "Report",
    color: "text-[#A1A1AA]",
    bg: "bg-white/[0.04]",
    border: "border-white/[0.08]",
    icon: "FileText",
  },
  CLEANUP: {
    label: "Cleanup",
    color: "text-[#A1A1AA]",
    bg: "bg-white/[0.04]",
    border: "border-white/[0.08]",
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
