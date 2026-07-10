"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateJob } from "@/hooks/useJobs";
import type { CreateJobInput } from "@/types";
import {
  DEFAULT_EMAIL_VALUES,
  DEFAULT_REMINDER_VALUES,
  DEFAULT_STEP1_VALUES,
  DEFAULT_STEP3_VALUES,
  DEFAULT_WEBHOOK_VALUES,
} from "./createJobDialog.constants";
import { buildCreateJobInput } from "./createJobDialog.utils";
import {
  emailPayloadSchema,
  reminderPayloadSchema,
  step1Schema,
  step3Schema,
  webhookPayloadSchema,
  type EmailData,
  type ReminderData,
  type Step1Data,
  type Step3Data,
  type WebhookData,
} from "./createJobDialog.schemas";
import type { CreateJobDialogDraft } from "./createJobDialog.types";
import { JobTypeStep } from "./JobTypeStep";
import { JobPayloadStep } from "./JobPayloadStep";
import { JobScheduleStep } from "./JobScheduleStep";

interface CreateJobDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateJobDialog({ open, onClose }: CreateJobDialogProps) {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Partial<CreateJobDialogDraft>>({});
  const createJob = useCreateJob();

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: DEFAULT_STEP1_VALUES,
  });

  const emailForm = useForm<EmailData>({
    resolver: zodResolver(emailPayloadSchema),
    defaultValues: DEFAULT_EMAIL_VALUES,
  });

  const webhookForm = useForm<WebhookData>({
    resolver: zodResolver(webhookPayloadSchema),
    defaultValues: DEFAULT_WEBHOOK_VALUES,
  });

  const reminderForm = useForm<ReminderData>({
    resolver: zodResolver(reminderPayloadSchema),
    defaultValues: DEFAULT_REMINDER_VALUES,
  });

  const step3Form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema) as any,
    defaultValues: DEFAULT_STEP3_VALUES,
  });

  const selectedType = step1Form.watch("type");

  const reset = () => {
    setStep(1);
    setDraft({});
    step1Form.reset(DEFAULT_STEP1_VALUES);
    emailForm.reset(DEFAULT_EMAIL_VALUES);
    webhookForm.reset(DEFAULT_WEBHOOK_VALUES);
    reminderForm.reset(DEFAULT_REMINDER_VALUES);
    step3Form.reset(DEFAULT_STEP3_VALUES);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const onStep1Submit: SubmitHandler<Step1Data> = (data) => {
    setDraft((previous) => ({ ...previous, step1: data }));
    setStep(2);
  };

  const onStep2Submit = async () => {
    let payload: Record<string, unknown> = {};
    let valid = false;

    if (selectedType === "EMAIL") {
      valid = await emailForm.trigger();
      if (valid) payload = emailForm.getValues() as Record<string, unknown>;
    } else if (selectedType === "WEBHOOK") {
      valid = await webhookForm.trigger();
      if (valid) payload = webhookForm.getValues() as Record<string, unknown>;
    } else {
      valid = await reminderForm.trigger();
      if (valid) payload = reminderForm.getValues() as Record<string, unknown>;
    }

    if (valid) {
      setDraft((previous) => ({ ...previous, payload }));
      setStep(3);
    }
  };

  const onFinalSubmit: SubmitHandler<Step3Data> = async (step3Data) => {
    if (!draft.step1 || !draft.payload) {
      return;
    }

    const input: CreateJobInput = buildCreateJobInput({
      step1: draft.step1,
      payload: draft.payload,
      step3: step3Data,
    });

    try {
      await createJob.mutateAsync(input);
      toast.success("Job created successfully");
      handleClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create job",
      );
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative z-10 w-full max-w-lg mx-4 card shadow-2xl shadow-black/50 max-h-[90dvh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60">
          <div>
            <h2 className="text-base font-semibold text-zinc-100">
              Create Job
            </h2>
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

        <div className="flex gap-1 px-6 pt-4">
          {[1, 2, 3].map((currentStep) => (
            <div
              key={currentStep}
              className={cn(
                "h-0.5 flex-1 rounded-full transition-colors",
                currentStep <= step ? "bg-indigo-500" : "bg-zinc-800",
              )}
            />
          ))}
        </div>

        {step === 1 && (
          <JobTypeStep form={step1Form} onSubmit={onStep1Submit} />
        )}

        {step === 2 && (
          <JobPayloadStep
            type={selectedType}
            emailForm={emailForm}
            webhookForm={webhookForm}
            reminderForm={reminderForm}
            onBack={() => setStep(1)}
            onNext={onStep2Submit}
          />
        )}

        {step === 3 && (
          <form onSubmit={step3Form.handleSubmit(onFinalSubmit)}>
            <JobScheduleStep
              form={step3Form}
              onBack={() => setStep(2)}
              isSubmitting={createJob.isPending}
            />
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
