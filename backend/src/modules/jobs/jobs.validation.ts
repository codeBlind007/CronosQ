import { z } from "zod";
import {JobType, JobPriority} from "../../types/jobTypes";


export const createJobSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50),

  description: z
    .string()
    .max(500)
    .optional(),

  type: z.nativeEnum(JobType),

  priority: z
    .nativeEnum(JobPriority)
    .default(JobPriority.NORMAL),

  payload: z
    .record(z.string(), z.any())
    .optional(),

  isRecurring: z
    .boolean()
    .default(false),

  cronExpression: z
    .string()
    .optional(),

  scheduledAt: z
    .coerce
    .date()
    .optional(),

  maxRetries: z
    .number()
    .int()
    .min(0)
    .max(10)
    .default(3),

  retryDelaySeconds: z
    .number()
    .int()
    .min(1)
    .max(86400)
    .default(60),
})
.refine(
  (data) => {
    if (data.isRecurring) {
      return !!data.cronExpression;
    }

    return true;
  },
  {
    message: "cronExpression is required for recurring jobs",
    path: ["cronExpression"],
  }
);