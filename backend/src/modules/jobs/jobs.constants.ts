import { JobType } from "./jobs.types";

export const JOB_QUEUES: Record<JobType, string> = {
  EMAIL: "email-queue",
  WEBHOOK: "webhook-queue",
  REMINDER: "reminder-queue",
  REPORT: "report-queue",
  CLEANUP: "cleanup-queue",
};