"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Menu, Zap } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-[#09090B]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-white/8 bg-[#111318] sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <Zap size={18} className="text-indigo-400" />
          <span className="font-semibold text-[#FAFAFA] tracking-tight">
            CronosQ
          </span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-1.5 -mr-1.5 rounded-lg text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-white/4 transition-all"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="lg:pl-65 flex-1 w-full">
        <main className="min-h-dvh flex flex-col">{children}</main>
      </div>
    </div>
  );
}
