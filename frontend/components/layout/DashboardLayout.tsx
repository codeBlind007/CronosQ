"use client";

import { Sidebar } from "@/components/layout/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-dvh bg-[#09090B]">
      <Sidebar />
      <div className="pl-[260px]">
        <main className="min-h-dvh flex flex-col">{children}</main>
      </div>
    </div>
  );
}
