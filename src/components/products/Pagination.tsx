"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { ALLOWED_LIMITS } from "@/lib/urlState";

interface PaginationProps {
  currentPage: number;
  limit: 10 | 20 | 50;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: 10 | 20 | 50) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  limit,
  total,
  onPageChange,
  onLimitChange,
}) => {
  const totalPages = Math.ceil(total / limit) || 1;
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const startRange = total === 0 ? 0 : (safePage - 1) * limit + 1;
  const endRange = Math.min(safePage * limit, total);

  // Generate smart page number items (e.g., [1, '...', 4, 5, 6, '...', 10])
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    pages.push(1);

    if (safePage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, safePage - 1);
    const end = Math.min(totalPages - 1, safePage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (safePage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-slate-800/80 text-xs text-slate-400">
      {/* Range and limit selector */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="font-medium text-slate-300">
          Showing <span className="text-cyan-400 font-semibold">{startRange}–{endRange}</span> of{" "}
          <span className="text-slate-100 font-semibold">{total}</span> products
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="limit-select" className="text-slate-400 font-medium">
            Per page:
          </label>
          <select
            id="limit-select"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value) as 10 | 20 | 50)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 transition cursor-pointer"
          >
            {ALLOWED_LIMITS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        {/* First page button */}
        <button
          onClick={() => onPageChange(1)}
          disabled={safePage <= 1}
          className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="First Page"
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous page button */}
        <button
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage <= 1}
          className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Previous Page"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page number buttons */}
        <div className="flex items-center gap-1">
          {pages.map((item, index) => {
            if (item === "...") {
              return (
                <span key={`ellipsis-${index}`} className="px-2 py-1 text-slate-500">
                  ...
                </span>
              );
            }
            const isCurrent = item === safePage;
            return (
              <button
                key={`page-${item}`}
                onClick={() => onPageChange(Number(item))}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-medium transition ${
                  isCurrent
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                    : "bg-slate-900/80 text-slate-300 border border-slate-800 hover:bg-slate-800"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Next page button */}
        <button
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage >= totalPages}
          className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Next Page"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last page button */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={safePage >= totalPages}
          className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Last Page"
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
