import { Controller, type UseFormReturn } from "react-hook-form";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JobType } from "@/types";
import type {
  EmailData,
  ReminderData,
  ReminderChannel,
  WebhookData,
} from "./createJobDialog.schemas";
import { HTTP_METHODS, REMINDER_CHANNELS } from "./createJobDialog.constants";
import { Field } from "./Field";
import { StepButton } from "./StepButton";
import { toggleValue } from "./createJobDialog.utils";

interface JobPayloadStepProps {
  type: JobType;
  emailForm: UseFormReturn<EmailData>;
  webhookForm: UseFormReturn<WebhookData>;
  reminderForm: UseFormReturn<ReminderData>;
  onBack: () => void;
  onNext: () => Promise<void> | void;
}

export function JobPayloadStep({
  type,
  emailForm,
  webhookForm,
  reminderForm,
  onBack,
  onNext,
}: JobPayloadStepProps) {
  const content =
    type === "EMAIL" ? (
      <EmailPayloadForm form={emailForm} />
    ) : type === "WEBHOOK" ? (
      <WebhookPayloadForm form={webhookForm} />
    ) : (
      <ReminderPayloadForm form={reminderForm} />
    );

  return (
    <div className="p-6 flex flex-col gap-5">
      <p className="text-sm font-medium text-zinc-300">
        Configure{" "}
        {type === "EMAIL"
          ? "email"
          : type === "WEBHOOK"
            ? "webhook"
            : "reminder"}{" "}
        details
      </p>

      {content}

      <div className="flex justify-between">
        <StepButton
          variant="secondary"
          icon={ChevronLeft}
          iconPosition="left"
          onClick={onBack}
        >
          Back
        </StepButton>
        <StepButton icon={ChevronRight} onClick={onNext}>
          Next
        </StepButton>
      </div>
    </div>
  );
}

function EmailPayloadForm({ form }: { form: UseFormReturn<EmailData> }) {
  return (
    <div className="flex flex-col gap-4">
      <Field
        label="Recipient email *"
        error={form.formState.errors.to?.message}
      >
        <input
          {...form.register("to")}
          type="email"
          placeholder="user@example.com"
          className="input-field"
        />
      </Field>
      <Field label="Subject *" error={form.formState.errors.subject?.message}>
        <input
          {...form.register("subject")}
          placeholder="Email subject"
          className="input-field"
        />
      </Field>
      <Field label="Body *" error={form.formState.errors.body?.message}>
        <textarea
          {...form.register("body")}
          rows={4}
          placeholder="Email body..."
          className="input-field resize-none"
        />
      </Field>
    </div>
  );
}

function WebhookPayloadForm({ form }: { form: UseFormReturn<WebhookData> }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-3">
        <Field label="Method" className="col-span-1">
          <select {...form.register("method")} className="input-field">
            {HTTP_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="URL *"
          error={form.formState.errors.url?.message}
          className="col-span-3"
        >
          <input
            {...form.register("url")}
            placeholder="https://api.example.com/hook"
            className="input-field"
          />
        </Field>
      </div>
      <Field label="Request body (JSON)">
        <textarea
          {...form.register("body")}
          rows={4}
          placeholder='{"key": "value"}'
          className="input-field font-mono text-xs resize-none"
        />
      </Field>
    </div>
  );
}

function ReminderPayloadForm({ form }: { form: UseFormReturn<ReminderData> }) {
  return (
    <div className="flex flex-col gap-4">
      <Field label="Title *" error={form.formState.errors.title?.message}>
        <input
          {...form.register("title")}
          placeholder="Reminder title"
          className="input-field"
        />
      </Field>
      <Field label="Message *" error={form.formState.errors.message?.message}>
        <textarea
          {...form.register("message")}
          rows={3}
          placeholder="Reminder message..."
          className="input-field resize-none"
        />
      </Field>

      <Field
        label="Delivery channels *"
        error={form.formState.errors.channels?.message}
      >
        <Controller
          control={form.control}
          name="channels"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2">
              {REMINDER_CHANNELS.map((channel) => {
                const selected = field.value.includes(
                  channel.value as ReminderChannel,
                );

                return (
                  <button
                    key={channel.value}
                    type="button"
                    onClick={() =>
                      field.onChange(toggleValue(field.value, channel.value))
                    }
                    className={cn(
                      "flex flex-col gap-1.5 rounded-lg border px-3 py-2 text-left transition-all",
                      selected
                        ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-200"
                        : "border-zinc-800 text-zinc-500 hover:border-zinc-700",
                    )}
                  >
                    <span className="text-xs font-medium">{channel.label}</span>
                    <span className="text-[10px] leading-tight text-zinc-500">
                      {channel.description}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        />
      </Field>
    </div>
  );
}
