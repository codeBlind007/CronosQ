import {
  Controller,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Step1Data } from "./createJobDialog.schemas";
import { JOB_TYPES } from "./createJobDialog.constants";
import { Field } from "./Field";
import { StepButton } from "./StepButton";

interface JobTypeStepProps {
  form: UseFormReturn<Step1Data>;
  onSubmit: SubmitHandler<Step1Data>;
}

export function JobTypeStep({ form, onSubmit }: JobTypeStepProps) {
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="p-6 flex flex-col gap-5"
    >
      <p className="text-sm font-medium text-zinc-300">Select job type</p>

      <Controller
        control={form.control}
        name="type"
        render={({ field }) => (
          <div className="grid grid-cols-3 gap-3">
            {JOB_TYPES.map(
              ({ type, icon: Icon, label, description, color, iconColor }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => field.onChange(type)}
                  className={cn(
                    "flex flex-col gap-2 p-3 rounded-xl border text-left transition-all",
                    field.value === type
                      ? `${color} ring-1 ring-offset-0`
                      : "border-zinc-800 hover:border-zinc-700",
                  )}
                >
                  <Icon size={18} className={iconColor} />
                  <span className="text-xs font-semibold text-zinc-200">
                    {label}
                  </span>
                  <span className="text-[10px] text-zinc-500 leading-tight">
                    {description}
                  </span>
                </button>
              ),
            )}
          </div>
        )}
      />

      <Field label="Job Name *" error={form.formState.errors.name?.message}>
        <input
          {...form.register("name")}
          placeholder="e.g. Daily welcome email"
          className="input-field"
        />
      </Field>

      <Field label="Description">
        <textarea
          {...form.register("description")}
          rows={2}
          placeholder="Optional description..."
          className="input-field resize-none"
        />
      </Field>

      <div className="flex justify-end">
        <StepButton type="submit" icon={ChevronRight}>
          Next
        </StepButton>
      </div>
    </form>
  );
}
