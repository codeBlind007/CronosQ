import {
  Mail,
  Webhook,
  Bell,
  RefreshCw,
  History,
  LayoutGrid,
  Shield,
  Radio,
} from "lucide-react";

const FEATURES = [
  {
    icon: Mail,
    title: "Email Jobs",
    description:
      "Schedule transactional emails to any recipient with custom subject and body content.",
  },
  {
    icon: Webhook,
    title: "Webhook Jobs",
    description:
      "Fire HTTP requests to any endpoint with custom method, headers, and payload.",
  },
  {
    icon: Bell,
    title: "Reminder Jobs",
    description:
      "Send in-app, email, or push reminders with configurable channels.",
  },
  {
    icon: Radio,
    title: "Real-time Updates",
    description:
      "Live job status updates via Socket.IO. Every change is instant.",
  },
  {
    icon: RefreshCw,
    title: "Retry Handling",
    description:
      "Configurable retry count and delay with dead-letter queue for failed jobs.",
  },
  {
    icon: History,
    title: "Execution History",
    description:
      "Full timeline of every job execution with attempt counts and error details.",
  },
  {
    icon: LayoutGrid,
    title: "Queue Management",
    description:
      "BullMQ-powered queues with priority levels, scheduling, and recurring crons.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description:
      "Clerk authentication with per-user job isolation. Your jobs are always private.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="px-10 py-24 max-w-[1400px] mx-auto">
      <div className="mb-16 max-w-[650px]">
        <p className="text-sm text-[#71717A] mb-3">Features</p>
        <h2 className="text-[32px] font-bold text-[#FAFAFA] tracking-tight leading-tight">
          Everything you need for reliable job scheduling
        </h2>
        <p className="mt-4 section-desc">
          Built on BullMQ, Redis, and Socket.IO for rock-solid distributed job
          execution.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="card card-hover p-6 flex flex-col gap-4 group"
          >
            <Icon
              size={18}
              className="text-[#71717A] group-hover:text-[#6366F1] transition-colors duration-150"
            />
            <div>
              <h3 className="text-sm font-semibold text-[#FAFAFA] mb-2">
                {title}
              </h3>
              <p className="text-[15px] text-[#71717A] leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
