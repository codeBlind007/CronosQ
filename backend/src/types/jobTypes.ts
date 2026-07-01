export enum JobType {
  EMAIL = "EMAIL",
  WEBHOOK = "WEBHOOK",
  REMINDER = "REMINDER",
  REPORT = "REPORT",
  CLEANUP = "CLEANUP",
}

export enum JobPriority {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}


export interface JobUserBody {
  name: string;
  description?: string;
  type: JobType;
  priority?: JobPriority;
  payload?: Record<string, any>;
  isRecurring?: boolean;
  cronExpression?: string;
  scheduledAt?: Date;
  maxRetries?: number;
  retryDelaySeconds?: number;
}