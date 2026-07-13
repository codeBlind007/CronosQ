const TESTIMONIALS = [
  {
    quote:
      "We replaced three cron scripts with CronosQ. Retries and monitoring just work — we haven't missed a webhook in months.",
    author: "Sarah Chen",
    role: "Backend Engineer",
    company: "Meridian Labs",
  },
  {
    quote:
      "The execution timeline alone saved us hours of debugging. Every failed job has full context without digging through logs.",
    author: "James Okonkwo",
    role: "Platform Lead",
    company: "Stackform",
  },
  {
    quote:
      "Real-time updates via Socket.IO mean our ops team sees failures the moment they happen. No more stale dashboards.",
    author: "Elena Vasquez",
    role: "DevOps Engineer",
    company: "Northwind Systems",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="px-10 py-24 max-w-[1400px] mx-auto">
      <div className="mb-16 max-w-[650px]">
        <p className="text-sm text-[#71717A] mb-3">Testimonials</p>
        <h2 className="text-[32px] font-bold text-[#FAFAFA] tracking-tight leading-tight">
          Trusted by engineering teams
        </h2>
        <p className="mt-4 section-desc">
          Teams use CronosQ to run production workloads with confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TESTIMONIALS.map(({ quote, author, role, company }) => (
          <div key={author} className="card p-6 flex flex-col gap-6">
            <p className="text-[15px] text-[#A1A1AA] leading-relaxed flex-1">
              &ldquo;{quote}&rdquo;
            </p>
            <div>
              <p className="text-sm font-medium text-[#FAFAFA]">{author}</p>
              <p className="text-sm text-[#71717A] mt-0.5">
                {role}, {company}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
