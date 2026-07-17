import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

const HERO_FEATURES = [
  {
    title: "Retry with backoff",
    description:
      "Failed jobs retry automatically with configurable delay and attempt limits.",
  },
  {
    title: "Real-time monitoring",
    description:
      "Socket.IO pushes status changes to your dashboard — no polling required.",
  },
  {
    title: "Full audit trail",
    description:
      "Every execution logged with attempt counts, timestamps, and error details.",
  },
];

export function HeroSection() {
  return (
    <section className="max-w-350 mx-auto px-10 pt-32 pb-24">
      <p className="text-sm text-[#71717A] mb-6">
        Distributed job scheduling
      </p>

      <h1 className="text-[48px] md:text-[56px] font-bold tracking-tight text-[#FAFAFA] max-w-162.5 leading-[1.1]">
        Reliable job scheduling for production systems
      </h1>

      <p className="mt-6 text-[17px] text-[#A1A1AA] max-w-162.5 leading-relaxed">
        Schedule emails, fire webhooks, and send reminders with full retry
        handling, real-time monitoring, and execution history — all in one
        platform.
      </p>

      <div className="flex items-center gap-4 mt-10">
        <Link
          href="/sign-up"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#6366F1] hover:bg-[#5558E3] hover:-translate-y-px text-white font-medium rounded-lg transition-all duration-150 text-sm"
        >
          Get Started
          <ArrowRight size={16} />
        </Link>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 border border-white/8 bg-[#111318] hover:bg-[#171A21] hover:-translate-y-px text-[#FAFAFA] font-medium rounded-lg transition-all duration-150 text-sm"
        >
          <ExternalLink size={16} />
          GitHub
        </a>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20">
        {HERO_FEATURES.map(({ title, description }) => (
          <div
            key={title}
            className="card card-hover p-6 flex flex-col gap-2"
          >
            <h3 className="text-sm font-semibold text-[#FAFAFA]">{title}</h3>
            <p className="text-[15px] text-[#71717A] leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
