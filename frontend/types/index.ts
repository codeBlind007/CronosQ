// ──────────────────────────────────────────────
// Enums
// ──────────────────────────────────────────────

export type JobType = "EMAIL" | "WEBHOOK" | "REMINDER" | "REPORT" | "CLEANUP";

export type JobStatus =
  | "PENDING"
  | "QUEUED"
  | "RUNNING"
  | "PAUSED"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type JobPriority = "LOW" | "NORMAL" | "HIGH" | "CRITICAL";

export type ExecutionStatus = "RUNNING" | "COMPLETED" | "FAILED";

export type NotificationEventType =
  | "REMINDER"
  | "JOB_COMPLETED"
  | "JOB_FAILED"
  | "JOB_RETRYING"
  | "SYSTEM";

// ──────────────────────────────────────────────
// Models
// ──────────────────────────────────────────────

export interface Job {
  id: string;
  name: string;
  description?: string | null;
  type: JobType;
  status: JobStatus;
  priority: JobPriority;
  queueName: string;
  isRecurring: boolean;
  cronExpression?: string | null;
  scheduledAt?: string | null;
  nextRunAt?: string | null;
  lastRunAt?: string | null;
  maxRetries: number;
  retryDelaySeconds: number;
  idempotencyKey?: string | null;
  deadLettered: boolean;
  payload?: Record<string, unknown> | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  executions?: JobExecution[];
}

export interface JobExecution {
  id: string;
  jobId: string;
  status: ExecutionStatus;
  attempt?: number;
  attemptNumber?: number;
  startedAt?: string | null;
  finishedAt?: string | null;
  durationMs?: number | null;
  errorMessage?: string | null;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  jobId?: string | null;
  title: string;
  message: string;
  type: NotificationEventType;
  isRead: boolean;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  readAt?: string | null;
}

// ──────────────────────────────────────────────
// API Payloads
// ──────────────────────────────────────────────

export interface EmailPayload {
  recipient: string;
  subject: string;
  body: string;
}

export interface WebhookPayload {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: string;
}

export interface ReminderPayload {
  title: string;
  message: string;
  channels?: string[];
}

export type JobPayload = EmailPayload | WebhookPayload | ReminderPayload;

export interface CreateJobInput {
  name: string;
  description?: string;
  type: JobType;
  priority?: JobPriority;
  payload?: Record<string, unknown>;
  isRecurring?: boolean;
  cronExpression?: string;
  scheduledAt?: string;
  maxRetries?: number;
  retryDelaySeconds?: number;
}

// ──────────────────────────────────────────────
// API Responses
// ──────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedJobsResponse {
  success: boolean;
  results: number;
  data: Job[];
}

export interface PaginatedNotificationsResponse {
  success: boolean;
  results: number;
  data: Notification[];
}

// ──────────────────────────────────────────────
// Query / Filter params
// ──────────────────────────────────────────────

export interface JobFilters {
  status?: JobStatus | "";
  type?: JobType | "";
  deadLettered?: boolean;
  page?: number;
  limit?: number;
}

// ──────────────────────────────────────────────
// Socket Events
// ──────────────────────────────────────────────

export interface JobSocketEvent {
  event:
    | "JOB_STARTED"
    | "JOB_COMPLETED"
    | "JOB_FAILED"
    | "JOB_RETRYING"
    | "JOB_CANCELLED"
    | "JOB_PAUSED"
    | "JOB_RESUMED"
    | "JOB_COMPLETED_NOTIFICATION"
    | "JOB_FAILED_NOTIFICATION";
  jobId: string;
  type: JobType;
  status: JobStatus;
  executionId?: string;
  attemptsMade?: number;
  name?: string;
  jobName?: string;
  timestamp: string;
  message?: string;
}

export interface NotificationSocketEvent {
  id: string;
  title: string;
  message: string;
  type: NotificationEventType;
  jobId?: string;
  createdAt: string;
}

// ──────────────────────────────────────────────
// Dashboard stats
// ──────────────────────────────────────────────

export interface DashboardStats {
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  cancelledJobs: number;
  pendingJobs: number;
}
