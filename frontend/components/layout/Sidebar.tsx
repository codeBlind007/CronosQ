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
    <aside className="fixed left-0 top-0 h-dvh w-[240px] border-r border-zinc-800/80 bg-zinc-950 flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-zinc-800/60">
        <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
          <Zap size={16} className="text-indigo-400" />
        </div>
        <span className="font-semibold text-zinc-100 tracking-tight">
          CronosQ
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {NAV.map(({ href, label, icon: Icon, exact, badge }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative",
                active
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              )}
            >
              <Icon size={16} />
              <span className="flex-1">{label}</span>
              {badge && unreadCount > 0 && (
                <span className="flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-indigo-500 text-white text-[10px] font-semibold">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-zinc-800/60">
        <button
          onClick={() => signOut({ redirectUrl: "/" })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-400/5 transition-colors"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
