import { z } from "zod";

const reminderChannelSchema = z.enum(["EMAIL", "IN_APP"]);

export const step1Schema = z.object({
  type: z.enum(["EMAIL", "WEBHOOK", "REMINDER"]),
  name: z.string().min(3, "At least 3 characters").max(50),
  description: z.string().max(200).optional(),
});

export const emailPayloadSchema = z.object({
  to: z.string().email("Valid email required"),
  subject: z.string().min(1, "Subject required"),
  body: z.string().min(1, "Body required"),
});

export const webhookPayloadSchema = z.object({
  url: z.string().url("Valid URL required"),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional(),
});

export const reminderPayloadSchema = z.object({
  title: z.string().min(1, "Title required"),
  message: z.string().min(1, "Message required"),
  channels: z
    .array(reminderChannelSchema)
    .min(1, "Select at least one channel"),
});

export const step3Schema = z.object({
  scheduleType: z.enum(["immediate", "scheduled", "recurring"]),
  scheduledAt: z.string().optional(),
  cronExpression: z.string().optional(),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "CRITICAL"]).default("NORMAL"),
  maxRetries: z.coerce.number().int().min(0).max(10).default(3),
  retryDelaySeconds: z.coerce.number().int().min(1).max(86400).default(60),
});

export type Step1Data = z.infer<typeof step1Schema>;
export type EmailData = z.infer<typeof emailPayloadSchema>;
export type WebhookData = z.infer<typeof webhookPayloadSchema>;
export type ReminderData = z.infer<typeof reminderPayloadSchema>;
export type Step3Data = z.infer<typeof step3Schema>;
