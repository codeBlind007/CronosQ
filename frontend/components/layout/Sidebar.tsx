"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Briefcase,
  Bell,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUnreadCount } from "@/hooks/useNotifications";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/jobs", label: "Jobs", icon: Briefcase, exact: false },
  {
    href: "/dashboard/notifications",
    label: "Notifications",
    icon: Bell,
    exact: false,
    badge: true,
  },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, exact: false },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const unreadCount = useUnreadCount();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="fixed left-0 top-0 h-dvh w-[260px] border-r border-white/[0.08] bg-[#111318] flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-6 border-b border-white/[0.08]">
        <Zap size={18} className="text-indigo-400" />
        <span className="font-semibold text-[#FAFAFA] tracking-tight">
          CronosQ
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-4 py-6 flex-1">
        {NAV.map(({ href, label, icon: Icon, exact, badge }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                active
                  ? "bg-indigo-500/10 text-[#FAFAFA]"
                  : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-white/[0.04]"
              )}
            >
              <Icon size={16} />
              <span className="flex-1">{label}</span>
              {badge && unreadCount > 0 && (
                <span className="flex items-center justify-center h-5 min-w-5 px-1.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[11px] font-medium">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-6 border-t border-white/[0.08]">
        <button
          onClick={() => signOut({ redirectUrl: "/" })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[#71717A] hover:text-[#FAFAFA] hover:bg-white/[0.04] transition-all duration-150"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
