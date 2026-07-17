"use client";

import { UserButton } from "@clerk/nextjs";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface TopbarProps {
  title: string;
  description?: string;
}

export function Topbar({ title, description }: TopbarProps) {
  return (
    <header className="flex items-center justify-between px-10 py-6 border-b border-white/8 bg-[#09090B] sticky top-0 z-20">
      <div>
        <h1 className="text-[34px] font-bold tracking-tight text-[#FAFAFA] leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-[15px] text-[#71717A] mt-2">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <NotificationBell />
        <div className="h-5 w-px bg-white/8" />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </div>
    </header>
  );
}
