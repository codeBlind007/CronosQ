import Link from "next/link";
import { ExternalLink, FileText, User } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 px-6 py-12 text-zinc-500">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo / Title */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-sm font-semibold text-zinc-300">CronosQ</span>
          <span className="text-xs text-zinc-600">
            Reliable distributed job scheduling.
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors"
          >
            <ExternalLink size={14} />
            GitHub
          </a>
          <Link
            href="/docs"
            className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors"
          >
            <FileText size={14} />
            Documentation
          </Link>
          <span className="flex items-center gap-1.5 text-zinc-600">
            <User size={14} />
            Author: CronosQ Dev Team
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-zinc-900 text-center md:text-left text-xs text-zinc-700">
        &copy; {new Date().getFullYear()} CronosQ. All rights reserved.
      </div>
    </footer>
  );
}
