import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="border-t border-white/8 bg-[#09090B] px-10 py-12">
      <div className="max-w-350 mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-sm font-semibold text-[#FAFAFA]">CronosQ</span>
          <span className="text-sm text-[#71717A]">
            Reliable distributed job scheduling.
          </span>
        </div>

        <div className="flex items-center gap-8 text-sm">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#71717A] hover:text-[#FAFAFA] transition-colors duration-150"
          >
            <ExternalLink size={14} />
            GitHub
          </a>
          <Link
            href="/docs"
            className="flex items-center gap-1.5 text-[#71717A] hover:text-[#FAFAFA] transition-colors duration-150"
          >
            <FileText size={14} />
            Documentation
          </Link>
        </div>
      </div>

      <div className="max-w-350 mx-auto mt-8 pt-8 border-t border-white/8 text-center md:text-left text-sm text-[#71717A]">
        &copy; {new Date().getFullYear()} CronosQ. All rights reserved.
      </div>
    </footer>
  );
}
