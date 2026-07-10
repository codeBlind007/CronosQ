import { Controller, type UseFormReturn } from "react-hook-form";
import { ChevronLeft, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Step3Data } from "./createJobDialog.schemas";
import { PRIORITIES } from "./createJobDialog.constants";
import { Field } from "./Field";
import { StepButton } from "./StepButton";

interface JobScheduleStepProps {
  form: UseFormReturn<Step3Data>;
  onBack: () => void;
  isSubmitting: boolean;
}

export function JobScheduleStep({
  form,
  onBack,
  isSubmitting,
}: JobScheduleStepProps) {
  const scheduleType = form.watch("scheduleType");

  return (
    <div className="p-6 flex flex-col gap-5">
      <p className="text-sm font-medium text-zinc-300">Schedule and options</p>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-zinc-400">Run timing</label>
        <Controller
          control={form.control}
          name="scheduleType"
          render={({ field }) => (
            <div className="grid grid-cols-3 gap-2">
              {(["immediate", "scheduled", "recurring"] as const).map(
                (option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => field.onChange(option)}
                    className={cn(
                      "py-2 px-3 rounded-lg border text-xs font-medium capitalize transition-all",
                      field.value === option
                        ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
                        : "border-zinc-800 text-zinc-500 hover:border-zinc-700",
                    )}
                  >
                    {option}
                  </button>
                ),
              )}
            </div>
          )}
        />
      </div>

      {scheduleType === "scheduled" && (
        <Field label="Scheduled at">
          <input
            {...form.register("scheduledAt")}
            type="datetime-local"
            className="input-field"
          />
        </Field>
      )}

      {scheduleType === "recurring" && (
        <Field label="Cron expression">
          <input
            {...form.register("cronExpression")}
            placeholder="e.g. 0 9 * * 1-5"
            className="input-field font-mono text-xs"
          />
        </Field>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-zinc-400">Priority</label>
        <Controller
          control={form.control}
          name="priority"
          render={({ field }) => (
            <div className="grid grid-cols-4 gap-2">
              {PRIORITIES.map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => field.onChange(priority)}
                  className={cn(
                    "py-1.5 px-2 rounded-lg border text-xs font-medium transition-all capitalize",
                    field.value === priority
                      ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
                      : "border-zinc-800 text-zinc-500 hover:border-zinc-700",
                  )}
                >
                  {priority.charAt(0) + priority.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Max retries">
          <input
            {...form.register("maxRetries")}
            type="number"
            min={0}
            max={10}
            className="input-field"
          />
        </Field>
        <Field label="Retry delay (s)">
          <input
            {...form.register("retryDelaySeconds")}
            type="number"
            min={1}
            className="input-field"
          />
        </Field>
      </div>

      <div className="flex justify-between">
        <StepButton
          variant="secondary"
          icon={ChevronLeft}
          iconPosition="left"
          onClick={onBack}
        >
          Back
        </StepButton>
        <StepButton
          type="submit"
          icon={isSubmitting ? Loader2 : Check}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Job"}
        </StepButton>
      </div>
    </div>
  );
}
