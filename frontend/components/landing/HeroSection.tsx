import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

export function HeroSection() {
  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-xs font-medium mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
        Distributed · Reliable · Production-ready
      </div>

      {/* Headline */}
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-100 max-w-3xl leading-[1.1]">
        Reliable Distributed
        <br />
        <span className="text-indigo-400">Job Scheduling</span>
      </h1>

      {/* Subheading */}
      <p className="mt-6 text-lg text-zinc-400 max-w-xl leading-relaxed">
        Schedule emails, fire webhooks, and send reminders with full retry
        handling, real-time monitoring, and execution history — all in one
        platform.
      </p>

      {/* CTAs */}
      <div className="flex items-center gap-4 mt-10">
        <Link
          href="/sign-up"
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors text-sm"
        >
          Get Started
          <ArrowRight size={16} />
        </Link>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-zinc-100 font-medium rounded-xl transition-colors text-sm bg-zinc-900 hover:bg-zinc-800"
        >
          <ExternalLink size={16} />
          GitHub
        </a>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-8 mt-16 text-sm text-zinc-600">
        {[
          ["3 job types", "Email, Webhook, Reminder"],
          ["Real-time", "Socket.IO updates"],
          ["Retry logic", "Configurable backoff"],
          ["Queue-based", "BullMQ + Redis"],
        ].map(([label, desc]) => (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <span className="text-zinc-300 font-medium">{label}</span>
            <span className="text-zinc-600 text-xs">{desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
