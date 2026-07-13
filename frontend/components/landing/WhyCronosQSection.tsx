import { Shield, Terminal, Activity, Layers } from "lucide-react";

const COMPARISONS = [
  {
    icon: Terminal,
    title: "Developer First",
    desc: "Comprehensive types, multi-step job configurations, and flexible cron scheduler formats.",
  },
  {
    icon: Activity,
    title: "Real-time Insight",
    desc: "Live socket dashboards update on completion, failure, retrying, and dead-letter states.",
  },
  {
    icon: Shield,
    title: "Fault Tolerant",
    desc: "Retry delays, exponential backoff, and status timelines protect against API errors.",
  },
  {
    icon: Layers,
    title: "Production Ready",
    desc: "Redis cluster configurations and robust BullMQ — the same engines used at scale.",
  },
];

export function WhyCronosQSection() {
  return (
    <section
      id="why-cronosq"
      className="px-10 py-24 bg-[#111318] border-t border-white/[0.08]"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16 max-w-[650px]">
          <p className="text-sm text-[#71717A] mb-3">Why CronosQ</p>
          <h2 className="text-[32px] font-bold text-[#FAFAFA] tracking-tight leading-tight">
            Designed for modern backend workflows
          </h2>
          <p className="mt-4 section-desc">
            Traditional cron servers break when scaled out. CronosQ solves
            distributed scheduling reliably.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
          {COMPARISONS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 p-6 card card-hover">
              <Icon size={18} className="text-[#71717A] flex-shrink-0 mt-0.5" />
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-[#FAFAFA]">{title}</h3>
                <p className="text-[15px] text-[#71717A] leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
