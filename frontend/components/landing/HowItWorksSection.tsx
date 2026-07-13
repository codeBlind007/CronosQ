"use client";

import { Plus, ArrowRight, Play, CheckCircle } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Create Job",
    description:
      "Define job name, type, payload, and priority through a guided flow.",
    icon: Plus,
  },
  {
    step: "02",
    title: "Queued",
    description:
      "Job is validated and stored in BullMQ queues backed by Redis.",
    icon: ArrowRight,
  },
  {
    step: "03",
    title: "Worker Executes",
    description:
      "Background workers pick up jobs based on type and schedule.",
    icon: Play,
  },
  {
    step: "04",
    title: "Notify & Log",
    description:
      "Execution history saved and real-time notifications sent to your dashboard.",
    icon: CheckCircle,
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="px-10 py-24 bg-[#111318] border-y border-white/[0.08]"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16 max-w-[650px]">
          <p className="text-sm text-[#71717A] mb-3">How it works</p>
          <h2 className="text-[32px] font-bold text-[#FAFAFA] tracking-tight leading-tight">
            From creation to execution
          </h2>
          <p className="mt-4 section-desc">
            Monitor every stage of your job lifecycles in real time.
          </p>
        </div>

        {/* Execution pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {STEPS.map(({ step, title, description, icon: Icon }, i) => (
            <div key={step} className="relative flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-[#71717A] tabular-nums">
                  {step}
                </span>
                <div className="flex items-center justify-center size-8 rounded-lg bg-[#171A21] border border-white/[0.08]">
                  <Icon size={16} className="text-[#71717A]" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#FAFAFA] mb-2">
                  {title}
                </h3>
                <p className="text-[15px] text-[#71717A] leading-relaxed">
                  {description}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-4 left-[calc(100%-8px)] w-4 h-px bg-white/[0.08]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
