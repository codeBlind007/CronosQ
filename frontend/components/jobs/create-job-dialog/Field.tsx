import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function Field({ label, error, children, className }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-xs font-medium text-zinc-400">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
