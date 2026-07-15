import type { CreateJobInput } from "@/types";
import type { CreateJobDialogDraft } from "./createJobDialog.types";

export function buildCreateJobInput({
  step1,
  payload,
  step3,
}: CreateJobDialogDraft): CreateJobInput {
  return {
    name: step1.name,
    description: step1.description,
    type: step1.type,
    priority: step3.priority,
    payload,
    maxRetries: step3.maxRetries,
    retryDelaySeconds: step3.retryDelaySeconds,
    isRecurring: false,
    cronExpression: undefined,
    scheduledAt:
      step3.scheduleType === "scheduled" ? step3.scheduledAt : undefined,
  };
}

export function toggleValue<T extends string>(values: readonly T[], value: T) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}
