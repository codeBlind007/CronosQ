"use client";

import { Shield, Sparkles, Terminal, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const COMPARISONS = [
  {
    icon: Terminal,
    title: "Developer First",
    desc: "Simple programmatic structures with comprehensive types, multi-step job configurations, and flexible cron scheduler formats.",
  },
  {
    icon: Activity,
    title: "Real-time Insight",
    desc: "Never guess if a task executed. Live socket dashboards update automatically on completion, failure, retrying, and dead-letter states.",
  },
  {
    icon: Shield,
    title: "Fault Tolerant",
    desc: "Retry delays, exponential backoff, status timelines, and failover support protect against missing webhooks or API errors.",
  },
  {
    icon: Sparkles,
    title: "Production Ready",
    desc: "Built with the same backend engines that drive industrial-scale applications: Redis cluster configurations and robust BullMQ.",
  },
];

export function WhyCronosQSection() {
  return (
    <section id="why-cronosq" className="px-6 py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs text-indigo-400 font-medium uppercase tracking-widest mb-3">
            Why CronosQ
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 tracking-tight">
            Designed for Modern Backend Workflows
          </h2>
          <p className="mt-4 text-zinc-400 text-base max-w-lg mx-auto">
            Traditional cron servers break when scaled out. CronosQ solves distributed scheduling reliably.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {COMPARISONS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 p-5 card card-hover">
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-indigo-400 h-fit">
                <Icon size={16} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed mt-1">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
