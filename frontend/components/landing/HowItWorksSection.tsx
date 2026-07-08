"use client";

import { Check, Plus, ArrowRight, Play, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    step: "01",
    title: "Create Job",
    description: "Define job name, type (Email, Webhook, Reminder), payload, and priority.",
    icon: Plus,
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
  },
  {
    step: "02",
    title: "Queued",
    description: "Job is validated and stored in BullMQ queues backed by Redis storage.",
    icon: ArrowRight,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    step: "03",
    title: "Worker",
    description: "Dedicated background workers pick up jobs based on type and schedule.",
    icon: Play,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
  },
  {
    step: "04",
    title: "Execution & Notification",
    description: "Job runs, saves execution history, and sends real-time UI notifications.",
    icon: CheckCircle,
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-6 py-24 bg-zinc-950 border-y border-zinc-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs text-indigo-400 font-medium uppercase tracking-widest mb-3">
            Workflow
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 tracking-tight">
            How CronosQ Works
          </h2>
          <p className="mt-4 text-zinc-400 text-base max-w-lg mx-auto">
            From creation to execution, monitor every stage of your job lifecycles in real time.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {STEPS.map(({ step, title, description, icon: Icon, color, bg }, i) => (
            <div key={step} className="flex flex-col gap-4 relative">
              {/* Step circle */}
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-zinc-800">{step}</span>
                <div className={cn("p-2.5 rounded-xl border border-zinc-800", bg)}>
                  <Icon size={16} className={color} />
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-200 mb-2">{title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
              </div>

              {/* Connector line for desktop */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-[18px] left-[110px] right-0 h-px bg-zinc-800/80 -z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
