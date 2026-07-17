"use client";

import { Cpu, Database, RefreshCw, Zap } from "lucide-react";

const ARCHITECTURE_NODES = [
  {
    title: "Next.js Dashboard",
    desc: "App router frontend that dispatches jobs and receives instant status updates via Socket.IO.",
    icon: Cpu,
  },
  {
    title: "Express API Gateway",
    desc: "Validates inputs with Zod, handles Clerk authentication, and schedules jobs onto Redis queues.",
    icon: Zap,
  },
  {
    title: "Redis / BullMQ",
    desc: "Reliable queue engine with retries, delayed delivery, and worker polling.",
    icon: Database,
  },
  {
    title: "Distributed Workers",
    desc: "Isolated workers processing webhooks, emails, and reminders with completion payloads.",
    icon: RefreshCw,
  },
];

export function ArchitectureSection() {
  return (
    <section id="architecture" className="px-10 py-24 max-w-350 mx-auto border-t border-white/8">
      <div className="mb-16 max-w-162.5">
        <p className="text-sm text-[#71717A] mb-3">Architecture</p>
        <h2 className="text-[32px] font-bold text-[#FAFAFA] tracking-tight leading-tight">
          Built for production workloads
        </h2>
        <p className="mt-4 section-desc">
          A distributed stack designed for zero-downtime job execution at scale.
        </p>
      </div>

      {/* Pipeline preview */}
      <div className="card p-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {ARCHITECTURE_NODES.map(({ title, icon: Icon }, i) => (
            <div key={title} className="relative flex flex-col items-center text-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-lg bg-[#171A21] border border-white/8">
                <Icon size={18} className="text-[#71717A]" />
              </div>
              <span className="text-sm font-medium text-[#FAFAFA]">{title}</span>
              {i < ARCHITECTURE_NODES.length - 1 && (
                <div className="hidden md:block absolute top-5 left-[calc(50%+28px)] w-[calc(100%-56px)] h-px bg-white/8" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detailed nodes */}
      <div className="relative border-l border-white/8 pl-8 ml-2 max-w-2xl flex flex-col gap-8">
        {ARCHITECTURE_NODES.map(({ title, desc, icon: Icon }) => (
          <div key={title} className="relative">
            <div className="absolute -left-10.25 top-1 flex items-center justify-center size-6 rounded-md bg-[#111318] border border-white/8">
              <Icon size={12} className="text-[#71717A]" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-[#FAFAFA]">{title}</h3>
              <p className="text-[15px] text-[#71717A] leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
