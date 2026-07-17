"use client";

import { useCallback } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchBar({
  placeholder = "Search…",
  value,
  onChange,
  className,
}: SearchBarProps) {
  const handleClear = useCallback(() => onChange(""), [onChange]);

  return (
    <div className={cn("relative", className)}>
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full pl-9 pr-9 py-2 text-sm rounded-lg",
          "bg-zinc-900 border border-zinc-800 text-zinc-200",
          "placeholder:text-zinc-600",
          "focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30",
          "transition-colors"
        )}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
