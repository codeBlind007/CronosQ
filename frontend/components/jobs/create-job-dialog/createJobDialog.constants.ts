import { Bell, Mail, Webhook } from "lucide-react";
import type { JobPriority } from "@/types";

export const JOB_TYPES = [
  {
    type: "EMAIL" as const,
    icon: Mail,
    label: "Email",
    description: "Send emails to recipients on a schedule.",
    color: "border-sky-500/40 bg-sky-500/5",
    iconColor: "text-sky-400",
  },
  {
    type: "WEBHOOK" as const,
    icon: Webhook,
    label: "Webhook",
    description: "Fire HTTP requests to any endpoint.",
    color: "border-violet-500/40 bg-violet-500/5",
    iconColor: "text-violet-400",
  },
  {
    type: "REMINDER" as const,
    icon: Bell,
    label: "Reminder",
    description: "Send in-app and email reminders.",
    color: "border-amber-500/40 bg-amber-500/5",
    iconColor: "text-amber-400",
  },
] as const;

export const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

export const PRIORITIES: JobPriority[] = ["LOW", "NORMAL", "HIGH", "CRITICAL"];

export const REMINDER_CHANNELS = [
  {
    value: "EMAIL" as const,
    label: "Email",
    description: "Send the reminder by email.",
  },
  {
    value: "IN_APP" as const,
    label: "In-app",
    description: "Show the reminder inside the app.",
  },
] as const;

export const DEFAULT_STEP1_VALUES = {
  type: "EMAIL" as const,
  name: "",
  description: "",
};

export const DEFAULT_EMAIL_VALUES = {
  to: "",
  subject: "",
  body: "",
};

export const DEFAULT_WEBHOOK_VALUES = {
  url: "",
  method: "POST" as const,
  body: "",
};

export const DEFAULT_REMINDER_VALUES = {
  title: "",
  message: "",
  channels: ["EMAIL", "IN_APP"] as Array<"EMAIL" | "IN_APP">,
};

export const DEFAULT_STEP3_VALUES = {
  scheduleType: "immediate" as const,
  priority: "NORMAL" as const,
  maxRetries: 3,
  retryDelaySeconds: 60,
};
