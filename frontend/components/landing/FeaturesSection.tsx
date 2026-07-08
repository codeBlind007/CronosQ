import {
  Mail,
  Webhook,
  Bell,
  Zap,
  RefreshCw,
  History,
  LayoutGrid,
  Shield,
} from "lucide-react";

const FEATURES = [
  {
    icon: Mail,
    title: "Email Jobs",
    description:
      "Schedule transactional emails to any recipient with custom subject and body content.",
    color: "text-sky-400",
    bg: "bg-sky-400/8",
    border: "border-sky-500/15",
  },
  {
    icon: Webhook,
    title: "Webhook Jobs",
    description:
      "Fire HTTP requests to any endpoint with custom method, headers, and payload.",
    color: "text-violet-400",
    bg: "bg-violet-400/8",
    border: "border-violet-500/15",
  },
  {
    icon: Bell,
    title: "Reminder Jobs",
    description:
      "Send in-app, email, or push reminders with configurable channels.",
    color: "text-amber-400",
    bg: "bg-amber-400/8",
    border: "border-amber-500/15",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description:
      "Live job status updates via Socket.IO. No polling. Every change is instant.",
    color: "text-indigo-400",
    bg: "bg-indigo-400/8",
    border: "border-indigo-500/15",
  },
  {
    icon: RefreshCw,
    title: "Retry Handling",
    description:
      "Configurable retry count and delay with dead-letter queue for failed jobs.",
    color: "text-orange-400",
    bg: "bg-orange-400/8",
    border: "border-orange-500/15",
  },
  {
    icon: History,
    title: "Execution History",
    description:
      "Full timeline of every job execution with attempt counts and error details.",
    color: "text-green-400",
    bg: "bg-green-400/8",
    border: "border-green-500/15",
  },
  {
    icon: LayoutGrid,
    title: "Queue Management",
    description:
      "BullMQ-powered queues with priority levels, scheduling, and recurring crons.",
    color: "text-cyan-400",
    bg: "bg-cyan-400/8",
    border: "border-cyan-500/15",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description:
      "Clerk authentication with per-user job isolation. Your jobs are always private.",
    color: "text-rose-400",
    bg: "bg-rose-400/8",
    border: "border-rose-500/15",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-24 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-xs text-indigo-400 font-medium uppercase tracking-widest mb-3">
          Features
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 tracking-tight">
          Everything you need for
          <br />
          reliable job scheduling
        </h2>
        <p className="mt-4 text-zinc-400 text-base max-w-lg mx-auto">
          Built on top of BullMQ, Redis, and Socket.IO for rock-solid
          distributed job execution.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map(({ icon: Icon, title, description, color, bg, border }) => (
          <div
            key={title}
            className={`card card-hover p-5 flex flex-col gap-3 border ${border}`}
          >
            <div className={`p-2 rounded-lg ${bg} w-fit`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">{title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
