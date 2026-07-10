import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepButtonProps {
  children: ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  icon: LucideIcon;
  iconPosition?: "left" | "right";
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export function StepButton({
  children,
  type = "button",
  onClick,
  icon: Icon,
  iconPosition = "right",
  variant = "primary",
  disabled,
}: StepButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
        variant === "primary"
          ? "bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-60"
          : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300",
      )}
    >
      {iconPosition === "left" && (
        <Icon size={15} className={disabled ? "animate-spin" : ""} />
      )}
      {children}
      {iconPosition === "right" && (
        <Icon size={15} className={disabled ? "animate-spin" : ""} />
      )}
    </button>
  );
}
