"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  total,
  perPage,
  onPageChange,
  className,
}: PaginationProps) {
  const totalPages = Math.ceil(total / perPage);
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  if (totalPages <= 1) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-3 border-t border-zinc-800/60 text-sm",
        className
      )}
    >
      <span className="text-zinc-500">
        Showing {from}–{to} of {total} results
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            page <= 1
              ? "text-zinc-700 cursor-not-allowed"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          )}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="px-3 py-1 text-zinc-400">
          {page} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            page >= totalPages
              ? "text-zinc-700 cursor-not-allowed"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          )}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
