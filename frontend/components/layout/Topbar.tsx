"use client";

import { UserButton } from "@clerk/nextjs";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface TopbarProps {
  title: string;
  description?: string;
}

export function Topbar({ title, description }: TopbarProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-20">
      <div>
        <h1 className="text-base font-semibold text-zinc-100">{title}</h1>
        {description && (
          <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <NotificationBell />
        <div className="h-5 w-px bg-zinc-800" />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-7 h-7",
            },
          }}
        />
      </div>
    </header>
  );
}
