"use client";

import { Cpu, Database, RefreshCw, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const ARCHITECTURE_NODES = [
  {
    title: "Clerk Client / Frontend",
    desc: "Next.js App router dashboard that triggers job dispatching and receives instant status notifications via Socket.IO Client.",
    icon: Cpu,
    color: "text-sky-400",
    bg: "bg-sky-400/10",
  },
  {
    title: "Express API gateway",
    desc: "Validates inputs with Zod schemas, handles Clerk user authentication middleware, and schedules jobs onto respective Redis queues.",
    icon: Zap,
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
  },
  {
    title: "Redis / BullMQ Stack",
    desc: "A reliable Redis caching/queue engine executing BullMQ schedules, supporting retries, delayed delivery, and active workers polling.",
    icon: Database,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
  },
  {
    title: "Distributed Workers",
    desc: "Isolated task execution threads processing Webhooks, Emails, and Reminders, publishing completion and error payloads.",
    icon: RefreshCw,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
];

export function ArchitectureSection() {
  return (
    <section id="architecture" className="px-6 py-24 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-xs text-indigo-400 font-medium uppercase tracking-widest mb-3">
          Architecture
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 tracking-tight">
          SaaS Architecture & Infrastructure
        </h2>
        <p className="mt-4 text-zinc-400 text-base max-w-lg mx-auto">
           Deep-dive into the technical workflow behind CronosQ&apos;s zero-downtime distributed stack.
        </p>
      </div>

      {/* Architecture Timeline layout */}
      <div className="relative border-l border-zinc-800/80 pl-6 ml-4 md:ml-8 max-w-3xl mx-auto flex flex-col gap-10">
        {ARCHITECTURE_NODES.map(({ title, desc, icon: Icon, color, bg }, i) => (
          <div key={title} className="relative group">
            {/* Timeline node icon */}
            <div
              className={cn(
                "absolute -left-[41px] top-0 p-1.5 rounded-lg border border-zinc-800 bg-zinc-950",
                bg
              )}
            >
              <Icon size={14} className={color} />
            </div>

            {/* Content card */}
            <div className="card p-5 card-hover flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed mt-1">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
