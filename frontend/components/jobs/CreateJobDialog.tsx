"use client";

import { useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Mail,
  Webhook,
  Bell,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  Plus,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateJob } from "@/hooks/useJobs";
import type { JobType, JobPriority, CreateJobInput } from "@/types";

// ── Zod schemas ──────────────────────────────────

const step1Schema = z.object({
  type: z.enum(["EMAIL", "WEBHOOK", "REMINDER"]),
  name: z.string().min(3, "At least 3 characters").max(50),
  description: z.string().max(200).optional(),
});

const emailPayloadSchema = z.object({
  recipient: z.string().email("Valid email required"),
  subject: z.string().min(1, "Subject required"),
  body: z.string().min(1, "Body required"),
});

const webhookPayloadSchema = z.object({
  url: z.string().url("Valid URL required"),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional(),
});

const reminderPayloadSchema = z.object({
  title: z.string().min(1, "Title required"),
  message: z.string().min(1, "Message required"),
});

const step3Schema = z.object({
  scheduleType: z.enum(["immediate", "scheduled", "recurring"]),
  scheduledAt: z.string().optional(),
  cronExpression: z.string().optional(),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "CRITICAL"]).default("NORMAL"),
  maxRetries: z.coerce.number().int().min(0).max(10).default(3),
  retryDelaySeconds: z.coerce.number().int().min(1).max(86400).default(60),
});

// ── Types ────────────────────────────────────────

type Step1Data = z.infer<typeof step1Schema>;
type EmailData = z.infer<typeof emailPayloadSchema>;
type WebhookData = z.infer<typeof webhookPayloadSchema>;
type ReminderData = z.infer<typeof reminderPayloadSchema>;
type Step3Data = z.infer<typeof step3Schema>;

interface FormData {
  step1: Step1Data;
  payload: Record<string, unknown>;
  step3: Step3Data;
}

// ── Job type cards ───────────────────────────────

const JOB_TYPES = [
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
    description: "Send in-app or push reminders.",
    color: "border-amber-500/40 bg-amber-500/5",
    iconColor: "text-amber-400",
  },
];

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;
const PRIORITIES: JobPriority[] = ["LOW", "NORMAL", "HIGH", "CRITICAL"];

// ── Main dialog ──────────────────────────────────

interface CreateJobDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateJobDialog({ open, onClose }: CreateJobDialogProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const createJob = useCreateJob();

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { type: "EMAIL", name: "", description: "" },
  });

  const emailForm = useForm<EmailData>({ resolver: zodResolver(emailPayloadSchema) });
  const webhookForm = useForm<WebhookData>({
    resolver: zodResolver(webhookPayloadSchema),
    defaultValues: { method: "POST" },
  });
  const reminderForm = useForm<ReminderData>({ resolver: zodResolver(reminderPayloadSchema) });

  const step3Form = useForm<Step3Data>({
    // Cast resolver to any to satisfy slight type differences between
    // zodResolver inferred types and our Step3Data strict typings.
    resolver: zodResolver(step3Schema) as any,
    defaultValues: {
      scheduleType: "immediate",
      priority: "NORMAL",
      maxRetries: 3,
      retryDelaySeconds: 60,
    },
  });

  const selectedType = step1Form.watch("type");
  const scheduleType = step3Form.watch("scheduleType");

  const reset = () => {
    setStep(1);
    setFormData({});
    step1Form.reset();
    emailForm.reset();
    webhookForm.reset();
    reminderForm.reset();
    step3Form.reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Step 1 submit
  const onStep1Submit: SubmitHandler<Step1Data> = (data) => {
    setFormData((prev) => ({ ...prev, step1: data }));
    setStep(2);
  };

  // Step 2 submit (dynamic based on type)
  const onStep2Submit = async () => {
    let payload: Record<string, unknown> = {};
    let valid = false;

    if (selectedType === "EMAIL") {
      valid = await emailForm.trigger();
      if (valid) payload = emailForm.getValues() as Record<string, unknown>;
    } else if (selectedType === "WEBHOOK") {
      valid = await webhookForm.trigger();
      if (valid) payload = webhookForm.getValues() as Record<string, unknown>;
    } else if (selectedType === "REMINDER") {
      valid = await reminderForm.trigger();
      if (valid) payload = reminderForm.getValues() as Record<string, unknown>;
    }

    if (valid) {
      setFormData((prev) => ({ ...prev, payload }));
      setStep(3);
    }
  };

  // Final submit
  const onFinalSubmit: SubmitHandler<any> = async (step3Data) => {
    if (!formData.step1) return;

    const input: CreateJobInput = {
      name: formData.step1.name,
      description: formData.step1.description,
      type: formData.step1.type,
      priority: step3Data.priority as JobPriority,
      payload: formData.payload,
      maxRetries: step3Data.maxRetries,
      retryDelaySeconds: step3Data.retryDelaySeconds,
      isRecurring: step3Data.scheduleType === "recurring",
      cronExpression:
        step3Data.scheduleType === "recurring"
          ? step3Data.cronExpression
          : undefined,
      scheduledAt:
        step3Data.scheduleType === "scheduled"
          ? step3Data.scheduledAt
          : undefined,
    };

    try {
      await createJob.mutateAsync(input);
      toast.success("Job created successfully");
      handleClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create job");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-lg mx-4 card shadow-2xl shadow-black/50 max-h-[90dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60">
          <div>
            <h2 className="text-base font-semibold text-zinc-100">Create Job</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Step {step} of 3</p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* Progress */}
        <div className="flex gap-1 px-6 pt-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-0.5 flex-1 rounded-full transition-colors",
                s <= step ? "bg-indigo-500" : "bg-zinc-800"
              )}
            />
          ))}
        </div>

        {/* Step 1 — Type & Name */}
        {step === 1 && (
          <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="p-6 flex flex-col gap-5">
            <p className="text-sm font-medium text-zinc-300">Select job type</p>

            <Controller
              control={step1Form.control}
              name="type"
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-3">
                  {JOB_TYPES.map(({ type, icon: Icon, label, description, color, iconColor }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => field.onChange(type)}
                      className={cn(
                        "flex flex-col gap-2 p-3 rounded-xl border text-left transition-all",
                        field.value === type
                          ? `${color} ring-1 ring-offset-0`
                          : "border-zinc-800 hover:border-zinc-700"
                      )}
                    >
                      <Icon size={18} className={iconColor} />
                      <span className="text-xs font-semibold text-zinc-200">{label}</span>
                      <span className="text-[10px] text-zinc-500 leading-tight">{description}</span>
                    </button>
                  ))}
                </div>
              )}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-400">Job Name *</label>
              <input
                {...step1Form.register("name")}
                placeholder="e.g. Daily welcome email"
                className="input-field"
              />
              {step1Form.formState.errors.name && (
                <p className="text-xs text-red-400">{step1Form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-400">Description</label>
              <textarea
                {...step1Form.register("description")}
                rows={2}
                placeholder="Optional description…"
                className="input-field resize-none"
              />
            </div>

            <div className="flex justify-end">
              <StepButton type="submit" icon={ChevronRight}>Next</StepButton>
            </div>
          </form>
        )}

        {/* Step 2 — Payload */}
        {step === 2 && (
          <div className="p-6 flex flex-col gap-5">
            <p className="text-sm font-medium text-zinc-300">
              Configure {selectedType === "EMAIL" ? "email" : selectedType === "WEBHOOK" ? "webhook" : "reminder"} details
            </p>

            {selectedType === "EMAIL" && <EmailPayloadForm form={emailForm} />}
            {selectedType === "WEBHOOK" && <WebhookPayloadForm form={webhookForm} />}
            {selectedType === "REMINDER" && <ReminderPayloadForm form={reminderForm} />}

            <div className="flex justify-between">
              <StepButton variant="secondary" icon={ChevronLeft} iconPosition="left" onClick={() => setStep(1)}>Back</StepButton>
              <StepButton icon={ChevronRight} onClick={onStep2Submit}>Next</StepButton>
            </div>
          </div>
        )}

        {/* Step 3 — Schedule & Options */}
        {step === 3 && (
          <form onSubmit={step3Form.handleSubmit(onFinalSubmit)} className="p-6 flex flex-col gap-5">
            <p className="text-sm font-medium text-zinc-300">Schedule & options</p>

            {/* Schedule type */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-zinc-400">Run timing</label>
              <Controller
                control={step3Form.control}
                name="scheduleType"
                render={({ field }) => (
                  <div className="grid grid-cols-3 gap-2">
                    {(["immediate", "scheduled", "recurring"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => field.onChange(t)}
                        className={cn(
                          "py-2 px-3 rounded-lg border text-xs font-medium capitalize transition-all",
                          field.value === t
                            ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
                            : "border-zinc-800 text-zinc-500 hover:border-zinc-700"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              />
            </div>

            {scheduleType === "scheduled" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">Scheduled at</label>
                <input
                  {...step3Form.register("scheduledAt")}
                  type="datetime-local"
                  className="input-field"
                />
              </div>
            )}

            {scheduleType === "recurring" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">Cron expression</label>
                <input
                  {...step3Form.register("cronExpression")}
                  placeholder="e.g. 0 9 * * 1-5"
                  className="input-field font-mono text-xs"
                />
              </div>
            )}

            {/* Priority */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-400">Priority</label>
              <Controller
                control={step3Form.control}
                name="priority"
                render={({ field }) => (
                  <div className="grid grid-cols-4 gap-2">
                    {PRIORITIES.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => field.onChange(p)}
                        className={cn(
                          "py-1.5 px-2 rounded-lg border text-xs font-medium transition-all capitalize",
                          field.value === p
                            ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
                            : "border-zinc-800 text-zinc-500 hover:border-zinc-700"
                        )}
                      >
                        {p.charAt(0) + p.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                )}
              />
            </div>

            {/* Retries */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">Max retries</label>
                <input
                  {...step3Form.register("maxRetries")}
                  type="number"
                  min={0}
                  max={10}
                  className="input-field"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">Retry delay (s)</label>
                <input
                  {...step3Form.register("retryDelaySeconds")}
                  type="number"
                  min={1}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <StepButton variant="secondary" icon={ChevronLeft} iconPosition="left" onClick={() => setStep(2)}>Back</StepButton>
              <StepButton
                type="submit"
                icon={createJob.isPending ? Loader2 : Check}
                disabled={createJob.isPending}
              >
                {createJob.isPending ? "Creating…" : "Create Job"}
              </StepButton>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .input-field {
          width: 100%;
          padding: 8px 12px;
          font-size: 13px;
          border-radius: 8px;
          background: #0f172a;
          border: 1px solid #27272a;
          color: #e4e4e7;
          outline: none;
          transition: border-color 150ms;
        }
        .input-field:focus {
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
        }
        .input-field::placeholder {
          color: #52525b;
        }
      `}</style>
    </div>
  );
}

// ── Sub-forms ────────────────────────────────────

function EmailPayloadForm({ form }: { form: ReturnType<typeof useForm<EmailData>> }) {
  return (
    <div className="flex flex-col gap-4">
      <Field label="Recipient email *" error={form.formState.errors.recipient?.message}>
        <input {...form.register("recipient")} type="email" placeholder="user@example.com" className="input-field" />
      </Field>
      <Field label="Subject *" error={form.formState.errors.subject?.message}>
        <input {...form.register("subject")} placeholder="Email subject" className="input-field" />
      </Field>
      <Field label="Body *" error={form.formState.errors.body?.message}>
        <textarea {...form.register("body")} rows={4} placeholder="Email body…" className="input-field resize-none" />
      </Field>
    </div>
  );
}

function WebhookPayloadForm({ form }: { form: ReturnType<typeof useForm<WebhookData>> }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-3">
        <Field label="Method" className="col-span-1">
          <select {...form.register("method")} className="input-field">
            {HTTP_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="URL *" error={form.formState.errors.url?.message} className="col-span-3">
          <input {...form.register("url")} placeholder="https://api.example.com/hook" className="input-field" />
        </Field>
      </div>
      <Field label="Request body (JSON)">
        <textarea {...form.register("body")} rows={4} placeholder='{"key": "value"}' className="input-field font-mono text-xs resize-none" />
      </Field>
    </div>
  );
}

function ReminderPayloadForm({ form }: { form: ReturnType<typeof useForm<ReminderData>> }) {
  return (
    <div className="flex flex-col gap-4">
      <Field label="Title *" error={form.formState.errors.title?.message}>
        <input {...form.register("title")} placeholder="Reminder title" className="input-field" />
      </Field>
      <Field label="Message *" error={form.formState.errors.message?.message}>
        <textarea {...form.register("message")} rows={3} placeholder="Reminder message…" className="input-field resize-none" />
      </Field>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-xs font-medium text-zinc-400">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function StepButton({
  children,
  type = "button",
  onClick,
  icon: Icon,
  iconPosition = "right",
  variant = "primary",
  disabled,
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  icon: React.ElementType;
  iconPosition?: "left" | "right";
  variant?: "primary" | "secondary";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
        variant === "primary"
          ? "bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-60"
          : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
      )}
    >
      {iconPosition === "left" && <Icon size={15} className={disabled ? "animate-spin" : ""} />}
      {children}
      {iconPosition === "right" && <Icon size={15} className={disabled ? "animate-spin" : ""} />}
    </button>
  );
}
